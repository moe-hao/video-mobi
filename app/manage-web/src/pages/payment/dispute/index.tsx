import { Button, Input, Spinner } from "@heroui/react";
import { useState } from "react";
import { useDisputeOrderState } from "@app/manage-web/hooks/payment/use-dispute-order-state";
import type { DisputeOrderReq } from "@lib/common/dto/order";
import { SkuType } from "@lib/common/consts/sku";
import { useUserDetail, useUserWatchHistory, useUserCoinHistory } from "@app/manage-web/hooks/user/use-user-detail";
import type { ManageUserHistoryReq } from "@lib/common/dto/user";
import { SectionTitle, InfoField, TabButton, DataTable } from "./components";
import { COIN_COMM_LABEL, ORDER_STATUS_LABEL, PAYMENT_TYPE_LABEL } from "./constants";

const PAGE_SIZE = 20;

export default function Dispute() {
  const { disputeOrderState, fetchDisputeOrderInfo } = useDisputeOrderState();
  const { userDetailState, fetchUserDetail } = useUserDetail();
  const { watchHistoryState, fetchWatchHistory } = useUserWatchHistory();
  const { coinHistoryState, fetchCoinHistory } = useUserCoinHistory();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<'watch' | 'coin'>('watch');
  const [userId, setUserId] = useState<number>(0);

  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    setShowResult(false);
    try {
      const order = await fetchDisputeOrderInfo({ search } as DisputeOrderReq);
      if (order.userId) {
        setUserId(order.userId);
        const req: ManageUserHistoryReq = { userId: order.userId, page: 1, size: PAGE_SIZE };
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

  const handleWatchPageChange = (page: number) => {
    fetchWatchHistory({ userId, page, size: PAGE_SIZE });
  };

  const handleCoinPageChange = (page: number) => {
    fetchCoinHistory({ userId, page, size: PAGE_SIZE });
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
          {/* Order Info */}
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
                emptyText="No watch history"
                columns={['Collection', 'Episode', 'Total Episodes', 'Cut Point', 'Status', 'Update Time']}
                rows={watchHistoryState.list?.map((item) => [
                  item.collectionName,
                  `Ep ${item.epNum}`,
                  `${item.collectionEpisodes} eps`,
                  `${item.cutPoint} eps`,
                  item.isDeleted ? <span key="del" className="text-red-500">Deleted</span> : <span key="ok" className="text-green-600">Normal</span>,
                  item.updateTime,
                ])}
                pagination={{ page: watchHistoryState.page, size: watchHistoryState.size, total: watchHistoryState.total, onPageChange: handleWatchPageChange }}
              />
            )}

            {activeTab === 'coin' && (
              <DataTable
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
                pagination={{ page: coinHistoryState.page, size: coinHistoryState.size, total: coinHistoryState.total, onPageChange: handleCoinPageChange }}
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
