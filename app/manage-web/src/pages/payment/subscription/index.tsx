import { Button, Input, Table } from "@heroui/react";
import { useEffect, useState } from "react";
import SubscriptionStatusPoint from "./subscription-status";
import { useSubscriptionListState } from "@app/manage-web/hooks/payment";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import type { SubscriptionListReq } from "@lib/common/dto/subscription";
import { useSearchParams } from "react-router";
import SubscriptionStatusSelect from "@app/manage-web/components/subscription-select/subscription-status-select";
import type { SubscriptionStatus } from "@lib/common/consts/subscription";

export default function SubscriptionList() {
  const { subscriptionListState, fetchSubscriptionTable } = useSubscriptionListState();
  const [_searchParams, setSearchParams] = useSearchParams();
  const [subscriptionListReq, setSubscriptionListReq] = useState<SubscriptionListReq>({
    page: 1,
    size: 20,
    id: '',
    status: '',
  });

  useEffect(() => {
    handleSearchSubscription(subscriptionListReq);
  }, [fetchSubscriptionTable]);

  const changeSearchParams = (req: SubscriptionListReq) => {
    setSearchParams({
      page: req.page.toString(),
      size: req.size.toString(),
      id: req.id.toString(),
      status: req.status.toString(),
    });
  }

  const handleSearchSubscription = (req: SubscriptionListReq) => {
    changeSearchParams(req);
    fetchSubscriptionTable(req);
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
            placeholder="搜索订阅ID"
            className="w-48"
            value={subscriptionListReq.id}
            onChange={(e) => setSubscriptionListReq({ ...subscriptionListReq, id: e.target.value })}
          />
          <SubscriptionStatusSelect className="w-48" value={subscriptionListReq.status as SubscriptionStatus} onChange={(status) => setSubscriptionListReq({ ...subscriptionListReq, status })} />
        </div>
        <Button variant="primary" size="sm" onClick={() => handleSearchSubscription(subscriptionListReq)}>查询</Button>
        <div className="flex-1"></div>
      </div>
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
              {/* <Table.Column>操作</Table.Column> */}
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
                  {/* <Table.Cell> */}
                  {/* <Button variant="secondary" size="sm">关单</Button> */}
                  {/* </Table.Cell> */}
                </Table.Row>
              ))}


            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
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
