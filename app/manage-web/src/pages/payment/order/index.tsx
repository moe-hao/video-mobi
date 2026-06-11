import { Button, Input, Table } from "@heroui/react";
import { useEffect } from "react";
import { useOrderListState } from "@app/manage-web/hooks/payment/use-order-list-state";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import OrderStatusPoint from "./order-status";

export default function OrderList() {
  const { orderListState, fetchOrderList } = useOrderListState();

  useEffect(() => {
    fetchOrderList({ page: 1, size: 20, search: "" });
  }, [fetchOrderList]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">订单管理</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Input
            aria-label="搜索"
            variant="secondary"
            placeholder="搜索订单ID/编号"
            className="w-48"
          // value={episodeListReq.search}
          // onChange={(e) => setEpisodeListReq({ ...episodeListReq, search: e.target.value })}
          />
        </div>
        <Button variant="primary" size="sm">查询</Button>
        <div className="flex-1"></div>
        {/* <CreateModalButton onSuccess={() => fetchEpisodeList(episodeListReq)} /> */}
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Team members" className="w-max min-w-full">
            <Table.Header>
              <Table.Column className="whitespace-nowrap">ID</Table.Column>
              <Table.Column className="whitespace-nowrap" isRowHeader>编号</Table.Column>
              <Table.Column className="whitespace-nowrap">来源</Table.Column>
              <Table.Column className="whitespace-nowrap">用户ID</Table.Column>
              <Table.Column className="whitespace-nowrap">邮箱</Table.Column>
              <Table.Column className="whitespace-nowrap">支付金额</Table.Column>
              <Table.Column className="whitespace-nowrap">订阅</Table.Column>
              <Table.Column className="whitespace-nowrap">订阅期数</Table.Column>
              <Table.Column className="whitespace-nowrap">支付渠道</Table.Column>
              <Table.Column className="whitespace-nowrap">支付方式</Table.Column>
              <Table.Column className="whitespace-nowrap">订单状态</Table.Column>
              <Table.Column className="whitespace-nowrap">创建时间</Table.Column>
              <Table.Column className="whitespace-nowrap">更新时间</Table.Column>
              {/* <Table.Column>操作</Table.Column> */}
            </Table.Header>
            <Table.Body>
              {orderListState.list?.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell className="whitespace-nowrap">{item.id}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.bizId}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.host}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.userId}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.email}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.currency} {item.amount}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.subscriptionId === 0 ? '非订阅' : '订阅'}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.subscriptionCount}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.paymentChennel}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.paymentTypeName}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    <OrderStatusPoint orderStatus={item.orderStatus} orderStatusName={item.orderStatusName} />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.createTime} </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.updateTime}</Table.Cell>
                  {/* <Table.Cell>
                    <Button variant="secondary" size="sm">关单</Button>
                  </Table.Cell> */}
                </Table.Row>
              ))}


            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <TablePagination
        page={orderListState.page || 1}
        size={orderListState.size || 10}
        total={orderListState.total || 0}
        onPageChange={(page) => fetchOrderList({ search: "", page, size: 20, })}
      />
    </div>
  )
};
