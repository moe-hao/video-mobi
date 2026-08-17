import { Button, Input, Spinner, Table } from "@heroui/react";
import { useState } from "react";
import { useDisputeOrderState } from "@app/manage-web/hooks/payment/use-dispute-order-state";
import type { DisputeOrderReq } from "@lib/common/dto/order";
import { SkuType } from "@lib/common/consts/sku";
import { OrderStatusNameEn } from "@lib/common/consts/order";
import { PaymentType } from "@lib/common/consts/payment";
import { useUserDetail, useUserWatchHistory, useUserCoinHistory } from "@app/manage-web/hooks/user/use-user-detail";
import type { ManageUserHistoryReq } from "@lib/common/dto/user";

const COIN_COMM_LABEL: Record<string, string> = {
  charge: 'Charge',
  expense: 'Expense',
};

const ORDER_STATUS_LABEL: Record<number, string> = OrderStatusNameEn;

const PAYMENT_TYPE_LABEL: Record<string, string> = {
  [PaymentType.ApplePay]: 'Apple Pay',
  [PaymentType.GooglePay]: 'Google Pay',
  [PaymentType.Card]: 'Credit/Debit Card',
  [PaymentType.Paypal]: 'PayPal',
  [PaymentType.Pix]: 'Pix',
  [PaymentType.MercadoPago]: 'MercadoPago',
};

export default function Dispute() {
  const { disputeOrderState, fetchDisputeOrderInfo } = useDisputeOrderState();
  const { userDetailState, fetchUserDetail } = useUserDetail();
  const { watchHistoryState, fetchWatchHistory } = useUserWatchHistory();
  const { coinHistoryState, fetchCoinHistory } = useUserCoinHistory();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<'watch' | 'coin'>('watch');

  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    setShowResult(false);
    try {
      const order = await fetchDisputeOrderInfo({ search } as DisputeOrderReq);
      if (order.userId) {
        const req: ManageUserHistoryReq = { userId: order.userId, page: 1, size: 20 };
        await Promise.all([
          fetchUserDetail(order.userId),
          fetchWatchHistory(req),
          fetchCoinHistory(req),
        ]);
      }
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header + Search */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">Dispute Order</div>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <Input
          aria-label="order"
          variant="secondary"
          placeholder="Order No / Channel No"
          className="w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="primary" size="sm" onClick={handleSearch}>Search</Button>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {/* Results */}
      {showResult && !loading && disputeOrderState.id && (
        <div className="space-y-6">
          {/* Order Info - card layout */}
          <section>
            <SectionTitle>Order Info</SectionTitle>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoField label="Order No" value={disputeOrderState.bizId} />
                <InfoField label="User ID" value={disputeOrderState.userId} />
                <InfoField label="User No" value={disputeOrderState.userNo} />
                <InfoField label="Amount" value={`${disputeOrderState.currency} ${disputeOrderState.amount}`} />
                <InfoField label="Type" value={disputeOrderState.orderType === SkuType.Subscription ? 'Subscription' : 'Coin'} />
                <InfoField label="Channel" value={disputeOrderState.paymentChennel} />
                <InfoField label="Payment Type" value={PAYMENT_TYPE_LABEL[disputeOrderState.paymentType] || disputeOrderState.paymentTypeName} />
                <InfoField label="Payment ID" value={disputeOrderState.paymentId || '--'} />
                <InfoField label="Status" value={ORDER_STATUS_LABEL[disputeOrderState.orderStatus] || disputeOrderState.orderStatus} />
                <InfoField label="Create Time" value={disputeOrderState.createTime} />
                <InfoField label="Update Time" value={disputeOrderState.updateTime} />
              </div>
            </div>
          </section>

          {/* Member Info */}
          <section>
            <SectionTitle>Member Info</SectionTitle>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoField label="Status" value={userDetailState.memberStatus} highlight={userDetailState.memberStatus === 'Active' ? 'green' : 'red'} />
                <InfoField label="Expire Time" value={userDetailState.expireTime} />
                <InfoField label="Coin Balance" value={userDetailState.coinNum} />
              </div>
            </div>
          </section>

          {/* Tabs + History */}
          <section>
            <div className="flex gap-1 border-b border-gray-200 mb-4">
              <TabButton label="Watch History" active={activeTab === 'watch'} onClick={() => setActiveTab('watch')} />
              <TabButton label="Coin History" active={activeTab === 'coin'} onClick={() => setActiveTab('coin')} />
            </div>

            {activeTab === 'watch' && (
              <DataTable
                total={watchHistoryState.total}
                emptyText="No watch history"
                columns={['Collection', 'Episode', 'Total Episodes', 'Update Time']}
                rows={watchHistoryState.list?.map((item) => [
                  item.collectionName,
                  `Ep ${item.epNum}`,
                  `${item.collectionEpisodes} eps`,
                  item.updateTime,
                ])}
              />
            )}

            {activeTab === 'coin' && (
              <DataTable
                total={coinHistoryState.total}
                emptyText="No coin history"
                columns={['Coins', 'Type', 'Collection', 'Episode', 'Time']}
                rows={coinHistoryState.list?.map((item) => [
                  <span key="coin" className={item.commType === 'charge' ? 'text-green-600' : 'text-red-500'}>
                    {item.commType === 'charge' ? '+' : '-'}{item.coinNum}
                  </span>,
                  COIN_COMM_LABEL[item.commType] || item.commType,
                  item.collectionName,
                  item.epNum > 0 ? `Ep ${item.epNum}` : '--',
                  item.createTime,
                ])}
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-semibold text-gray-700 mb-2">{children}</div>;
}

function InfoField({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: 'green' | 'red' }) {
  const colorClass = highlight === 'green' ? 'text-green-600' : highlight === 'red' ? 'text-red-500' : 'text-gray-800';
  return (
    <div>
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className={`text-sm font-medium ${colorClass}`}>{value ?? '--'}</div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function DataTable({ columns, rows, total, emptyText }: { columns: string[]; rows?: React.ReactNode[][]; total?: number; emptyText: string }) {
  return (
    <div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content className="min-w-[600px]">
            <Table.Header>
              {columns.map((col) => (
                <Table.Column key={col} className="whitespace-nowrap">{col}</Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {rows && rows.length > 0 ? (
                rows.map((cells, i) => (
                  <Table.Row key={i}>
                    {cells.map((cell, j) => (
                      <Table.Cell key={j} className="whitespace-nowrap">{cell}</Table.Cell>
                    ))}
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={columns.length} className="text-center text-gray-400">{emptyText}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      {total != null && total > 0 && (
        <div className="text-xs text-gray-400 mt-2">Total: {total}</div>
      )}
    </div>
  );
}
