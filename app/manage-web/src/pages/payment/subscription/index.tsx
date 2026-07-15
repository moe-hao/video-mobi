import { Button, Input, Spinner, Table } from "@heroui/react";
import { useEffect, useState } from "react";
import SubscriptionStatusPoint from "./subscription-status";
import { useSubscriptionListState } from "@app/manage-web/hooks/payment";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import type { SubscriptionListReq } from "@lib/common/dto/subscription";
import { useSearchParams } from "react-router";
import SubscriptionStatusSelect from "@app/manage-web/components/subscription-select/subscription-status-select";
import type { SubscriptionStatus } from "@lib/common/consts/subscription";
import DateRange, { type DateRangeValue } from "@app/manage-web/components/date-range";

export default function SubscriptionList() {
  const { subscriptionListState, fetchSubscriptionTable } = useSubscriptionListState();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialParams: SubscriptionListReq = {
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 20,
    status: searchParams.get('status') || '',
    subscriptionNo: searchParams.get('subscriptionNo') || '',
    userId: searchParams.get('userId') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  };

  const initDateRange: DateRangeValue | null =
    initialParams.startDate && initialParams.endDate
      ? { start: Number(initialParams.startDate), end: Number(initialParams.endDate) }
      : null;

  const [subscriptionListReq, setSubscriptionListReq] = useState<SubscriptionListReq>(initialParams);
  const [dateRange, setDateRange] = useState<DateRangeValue | null>(initDateRange);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchSubscriptionTable(initialParams).finally(() => setLoading(false));
  }, []);

  const changeSearchParams = (req: SubscriptionListReq) => {
    setSearchParams({
      page: req.page.toString(),
      size: req.size.toString(),
      status: req.status.toString(),
      subscriptionNo: req.subscriptionNo.toString(),
      userId: req.userId.toString(),
      ...(req.startDate ? { startDate: req.startDate, endDate: req.endDate } : { startDate: "", endDate: "" }),
    });
  }

  const handleSearchSubscription = async (req: SubscriptionListReq) => {
    const finalReq = {
      ...req,
      ...(dateRange
        ? { startDate: dateRange.start.toString(), endDate: dateRange.end.toString() }
        : { startDate: "", endDate: "" }),
    };
    changeSearchParams(finalReq);
    setLoading(true);
    try {
      await fetchSubscriptionTable(finalReq);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">订阅管理</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Input
            aria-label="搜索"
            variant="secondary"
            placeholder="搜索订阅ID/编号"
            className="w-48"
            value={subscriptionListReq.subscriptionNo}
            onChange={(e) => setSubscriptionListReq({ ...subscriptionListReq, subscriptionNo: e.target.value })}
          />
          <Input
            aria-label="用户ID"
            variant="secondary"
            placeholder="搜索用户ID"
            className="w-48"
            value={subscriptionListReq.userId}
            onChange={(e) => setSubscriptionListReq({ ...subscriptionListReq, userId: e.target.value })}
          />
          <SubscriptionStatusSelect className="w-48" value={subscriptionListReq.status as SubscriptionStatus} onChange={(status) => setSubscriptionListReq({ ...subscriptionListReq, status })} />
          <DateRange className="w-72" defaultValue={initDateRange} onChange={setDateRange} />
        </div>
        <Button variant="primary" size="sm" onClick={() => handleSearchSubscription(subscriptionListReq)}>查询</Button>
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
          <Table.Content aria-label="Team members" className="min-w-[600px]">
            <Table.Header>
              <Table.Column>ID</Table.Column>
              <Table.Column isRowHeader>订阅编号</Table.Column>
              <Table.Column>用户ID</Table.Column>
              <Table.Column>订阅状态</Table.Column>
              <Table.Column>创建时间</Table.Column>
              <Table.Column>更新时间</Table.Column>
            </Table.Header>
            <Table.Body>
              {subscriptionListState.list?.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.subscriptionNo}</Table.Cell>
                  <Table.Cell>{item.userId}</Table.Cell>
                  <Table.Cell>
                    <SubscriptionStatusPoint status={item.subscriptionStatus} name={item.subscriptionStatusName} />
                  </Table.Cell>
                  <Table.Cell>{item.createTime} </Table.Cell>
                  <Table.Cell>{item.updateTime}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      </div>
      <TablePagination
        page={subscriptionListState.page || 1}
        size={subscriptionListState.size || 10}
        total={subscriptionListState.total || 0}
        sizeOptions={[20, 30, 50, 100]}
        onPageChange={(page) => handleSearchSubscription({ ...subscriptionListReq, page })}
        onSizeChange={(size) => handleSearchSubscription({ ...subscriptionListReq, size })}
      />
    </div>
  )
}
