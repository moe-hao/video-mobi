import { Button, Spinner, Table } from "@heroui/react";
import { useEffect, useState } from "react";
import { useLtvListState } from "@app/manage-web/hooks/report/use-ltv-list-state";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import type { LtvReportListReq } from "@lib/common/dto/ltv-report";
import type { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import DateRange, { type DateRangeValue } from "@app/manage-web/components/date-range";
import ProductMultipleSelect from "@app/manage-web/components/product-select/product-multiple-select";
import SubscriptionChannelSelect from "@app/manage-web/components/subscription-select/subscription-channel-select";
import PaymentTypeSelect from "@app/manage-web/components/payment-type-select";

const formatDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const calcRoi = (income: string, spend: string) => {
  const s = Number(spend);
  if (!s || s === 0) return '--';
  return `${(Number(income) / s * 100).toFixed(2)}%`;
};

const defaultDateRange: DateRangeValue | null = null;

export default function LtvReport() {
  const { ltvListState, fetchLtvList } = useLtvListState();
  const [loading, setLoading] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [req, setReq] = useState<LtvReportListReq>({
    page: 1,
    size: 20,
    startDateBegin: '',
    startDateEnd: '',
    productIds: '',
    paymentChannel: '',
    paymentType: '',
  });

  useEffect(() => {
    setLoading(true);
    fetchLtvList(req).finally(() => setLoading(false));
  }, []);

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts * 1000);
    return formatDate(d);
  };

  const handleDateRangeChange = (value: DateRangeValue | null) => {
    if (!value) {
      setReq({
        ...req,
        startDateBegin: '',
        startDateEnd: '',
      });
      return;
    }
    setReq({
      ...req,
      startDateBegin: formatTimestamp(value.start),
      startDateEnd: formatTimestamp(value.end),
    });
  };

  const handleSearch = async (params: LtvReportListReq) => {
    setReq(params);
    setLoading(true);
    try {
      await fetchLtvList(params);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">LTV 报表</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <DateRange
            className="w-72"
            defaultValue={defaultDateRange}
            onChange={handleDateRangeChange}
          />
          <ProductMultipleSelect
            className="w-72"
            value={selectedProductIds}
            onChange={(productIds) => {
              setSelectedProductIds(productIds);
              setReq({ ...req, productIds: productIds.join(',') });
            }}
          />
          <SubscriptionChannelSelect
            className="w-72"
            value={req.paymentChannel as PaymentChannel | ''}
            onChange={(channel) => setReq({ ...req, paymentChannel: channel })}
          />
          <PaymentTypeSelect
            className="w-72"
            value={req.paymentType as PaymentType | ''}
            onChange={(type) => setReq({ ...req, paymentType: type })}
          />
        </div>
        <Button variant="primary" size="sm" onClick={() => handleSearch({ ...req, page: 1 })}>查询</Button>
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <Spinner size="lg" />
          </div>
        )}
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="LTV报表数据" className="w-max min-w-full">
              <Table.Header>
                <Table.Column className="whitespace-nowrap" isRowHeader>日期</Table.Column>
                <Table.Column className="whitespace-nowrap">当日消耗</Table.Column>
                <Table.Column className="whitespace-nowrap">D0</Table.Column>
                <Table.Column className="whitespace-nowrap">D0 ROI</Table.Column>
                <Table.Column className="whitespace-nowrap">D7</Table.Column>
                <Table.Column className="whitespace-nowrap">D7 ROI</Table.Column>
                <Table.Column className="whitespace-nowrap">D14</Table.Column>
                <Table.Column className="whitespace-nowrap">D14 ROI</Table.Column>
                <Table.Column className="whitespace-nowrap">D21</Table.Column>
                <Table.Column className="whitespace-nowrap">D21 ROI</Table.Column>
                <Table.Column className="whitespace-nowrap">D28</Table.Column>
                <Table.Column className="whitespace-nowrap">D28 ROI</Table.Column>
                <Table.Column className="whitespace-nowrap">D35</Table.Column>
                <Table.Column className="whitespace-nowrap">D35 ROI</Table.Column>
                <Table.Column className="whitespace-nowrap">D42</Table.Column>
                <Table.Column className="whitespace-nowrap">D42 ROI</Table.Column>
                <Table.Column className="whitespace-nowrap">D49</Table.Column>
                <Table.Column className="whitespace-nowrap">D49 ROI</Table.Column>
                <Table.Column className="whitespace-nowrap">D56</Table.Column>
                <Table.Column className="whitespace-nowrap">D56 ROI</Table.Column>
              </Table.Header>
              <Table.Body renderEmptyState={() => <div className="py-10 text-center text-gray-400">暂无数据</div>}>
                {(ltvListState.list ?? []).map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell className="whitespace-nowrap">{item.startDate}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.spend === '0.00' ? '--' : `$${item.spend}`}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.d0Income === '0.00' ? '--' : `$${item.d0Income}`}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{calcRoi(item.d0Income, item.spend)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.d7Income === '0.00' ? '--' : `$${item.d7Income}`}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{calcRoi(item.d7Income, item.spend)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.d14Income === '0.00' ? '--' : `$${item.d14Income}`}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{calcRoi(item.d14Income, item.spend)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.d21Income === '0.00' ? '--' : `$${item.d21Income}`}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{calcRoi(item.d21Income, item.spend)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.d28Income === '0.00' ? '--' : `$${item.d28Income}`}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{calcRoi(item.d28Income, item.spend)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.d35Income === '0.00' ? '--' : `$${item.d35Income}`}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{calcRoi(item.d35Income, item.spend)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.d42Income === '0.00' ? '--' : `$${item.d42Income}`}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{calcRoi(item.d42Income, item.spend)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.d49Income === '0.00' ? '--' : `$${item.d49Income}`}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{calcRoi(item.d49Income, item.spend)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.d56Income === '0.00' ? '--' : `$${item.d56Income}`}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{calcRoi(item.d56Income, item.spend)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
      <TablePagination
        page={req.page || 1}
        size={req.size || 20}
        total={ltvListState.total || 0}
        sizeOptions={[20, 50, 100]}
        onPageChange={(page) => handleSearch({ ...req, page })}
        onSizeChange={(size) => handleSearch({ ...req, size })}
      />
    </div>
  );
}
