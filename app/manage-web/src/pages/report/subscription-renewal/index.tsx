import { Button, Spinner, Table } from "@heroui/react";
import { useEffect, useState } from "react";
import { useSubscriptionRenewalListState } from "@app/manage-web/hooks/report/use-subscription-renewal-list-state";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import type { SubscriptionRenewalReportListReq } from "@lib/common/dto/subscription-renewal-report";
import type { PaymentChannel, PaymentType } from "@lib/common/consts/payment";
import type { SkuPeriodType } from "@lib/common/consts/sku";
import { CalendarDate, type DateValue } from "@internationalized/date";
import SingleDatePicker from "@app/manage-web/components/date-picker";
import ProductMultipleSelect from "@app/manage-web/components/product-select/product-multiple-select";
import SubscriptionChannelSelect from "@app/manage-web/components/subscription-select/subscription-channel-select";
import PaymentTypeSelect from "@app/manage-web/components/payment-type-select";
import SubscriptionPeriodSelect from "@app/manage-web/components/subscription-period-select";
import { SkuPeriodType as SkuPeriodTypeEnum } from "@lib/common/consts/sku";

const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const todayCalendarDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

export default function SubscriptionRenewal() {
  const { subscriptionRenewalListState, fetchSubscriptionRenewalList } = useSubscriptionRenewalListState();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(todayCalendarDate);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [req, setReq] = useState<SubscriptionRenewalReportListReq>({
    page: 1,
    size: 20,
    date: todayStr,
    productIds: '',
    paymentChannel: '',
    paymentType: '',
    periodType: SkuPeriodTypeEnum.Week,
  });

  useEffect(() => {
    setLoading(true);
    fetchSubscriptionRenewalList(req).finally(() => setLoading(false));
  }, []);

  const handleDateChange = (date: DateValue | null) => {
    setSelectedDate(date);
    if (date) {
      const formatted = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
      setReq({ ...req, date: formatted });
    } else {
      setReq({ ...req, date: '' });
    }
  };

  const handleSearch = async (params: SubscriptionRenewalReportListReq) => {
    setReq(params);
    setLoading(true);
    try {
      await fetchSubscriptionRenewalList(params);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">续订统计</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <SingleDatePicker className="w-72" value={selectedDate} onChange={handleDateChange} clearable={false} />
          <SubscriptionPeriodSelect
            className="w-72"
            value={req.periodType as SkuPeriodType | ''}
            onChange={(period) => setReq({ ...req, periodType: period })}
            clearable={false}
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
        <div className="flex-1"></div>
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <Spinner size="lg" />
          </div>
        )}
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="续订统计数据" className="w-max min-w-full">
              <Table.Header>
                <Table.Column className="whitespace-nowrap" isRowHeader>订阅期数</Table.Column>
                <Table.Column className="whitespace-nowrap">订阅数量</Table.Column>
                <Table.Column className="whitespace-nowrap">对比上期续订比例</Table.Column>
              </Table.Header>
              <Table.Body renderEmptyState={() => <div className="py-10 text-center text-gray-400">暂无数据</div>}>
                {(subscriptionRenewalListState.list ?? []).map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell className="whitespace-nowrap">第{item.periodNum}期</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.subscriptionNum}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.renewalRate}</Table.Cell>
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
        total={subscriptionRenewalListState.total || 0}
        sizeOptions={[20, 50, 100]}
        onPageChange={(page) => handleSearch({ ...req, page })}
        onSizeChange={(size) => handleSearch({ ...req, size })}
      />
    </div>
  );
}
