import { Table } from "@heroui/react";
import { useEffect } from "react";
import SubscriptionStatusPoint from "./subscription-status";
import { useSubscriptionListState } from "@app/manage-web/hooks/payment";
import TablePagination from "@app/manage-web/components/pagination/pagination";

export default function SubscriptionList() {
  const { subscriptionListState, fetchSubscriptionTable } = useSubscriptionListState();

  useEffect(() => {
    fetchSubscriptionTable({ page: 1, size: 20 });
  }, [fetchSubscriptionTable]);


  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">订阅管理</div>
      </div>
       <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                {/* <Input
                  aria-label="搜索"
                  variant="secondary"
                  placeholder="搜索订单ID/编号"
                  className="w-48"
                // value={episodeListReq.search}
                // onChange={(e) => setEpisodeListReq({ ...episodeListReq, search: e.target.value })}
                /> */}
              </div>
              {/* <Button variant="primary" size="sm">查询</Button> */}
              <div className="flex-1"></div>
              {/* <CreateModalButton onSuccess={() => fetchEpisodeList(episodeListReq)} /> */}
            </div>
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Team members" className="min-w-[600px]">
                  <Table.Header>
                    <Table.Column>ID</Table.Column>
                    <Table.Column isRowHeader>订阅编号</Table.Column>
                    <Table.Column>用户信息</Table.Column>
                    <Table.Column>订阅状态</Table.Column>
                    <Table.Column>创建时间</Table.Column>
                    <Table.Column>更新时间</Table.Column>
                    <Table.Column>操作</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {subscriptionListState.list?.map((item) => (
                      <Table.Row key={item.id}>
                        <Table.Cell>{item.id}</Table.Cell>
                        <Table.Cell>{item.subscriptionNo}</Table.Cell>
                        <Table.Cell>{item.userInfo}</Table.Cell>
                        <Table.Cell>
                          <SubscriptionStatusPoint status={item.subscriptionStatus} name={item.subscriptionStatusName} />
                        </Table.Cell>
                        <Table.Cell>{item.createTime} </Table.Cell>
                        <Table.Cell>{item.updateTime}</Table.Cell>
                        <Table.Cell>
                          {/* <Button variant="secondary" size="sm">关单</Button> */}
                        </Table.Cell>
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
              onPageChange={(page) => fetchSubscriptionTable({ page, size:20 })}
            />
    </div>
  )
}
