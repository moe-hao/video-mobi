import { Button, Input, Link, Table, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { useOrderListState } from "@app/manage-web/hooks/payment/use-order-list-state";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import OrderStatusPoint from "./order-status";
import type { OrderListReq } from "@lib/common/dto/order";
import OrderStatusSelect from "@app/manage-web/components/order-select";
import type { OrderStatus } from "@lib/common/consts/order";
import { useSearchParams } from "react-router";

export default function OrderList() {
  const { orderListState, fetchOrderList } = useOrderListState();
  const [_searchParams, setSearchParams] = useSearchParams();
  const [orderListReq, setOrderListReq] = useState<OrderListReq>({ page: 1, size: 20, search: "", status: "" });

  useEffect(() => {
    handleSearch(orderListReq);
  }, [fetchOrderList]);

  const changeSearchParams = (orderListReq: OrderListReq) => {
    setSearchParams({
      page: orderListReq.page.toString(),
      size: orderListReq.size.toString(),
      search: orderListReq.search.toString(),
      status: orderListReq.status.toString(),
    });
  }

  const handleSearch = async (orderListReq: OrderListReq) => {
    changeSearchParams(orderListReq);
    await fetchOrderList(orderListReq);
  }

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
            value={orderListReq.search}
            onChange={(e) => setOrderListReq({ ...orderListReq, search: e.target.value })}
          />
          <OrderStatusSelect className="w-48" value={orderListReq.status as OrderStatus} onChange={(status) => setOrderListReq({ ...orderListReq, status: status as string })} />
        </div>
        <Button variant="primary" size="sm" onClick={() => handleSearch(orderListReq)}>查询</Button>
        <div className="flex-1"></div>
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Team members" className="w-max min-w-full">
            <Table.Header>
              <Table.Column className="whitespace-nowrap">ID</Table.Column>
              <Table.Column className="whitespace-nowrap" isRowHeader>编号</Table.Column>
              <Table.Column className="whitespace-nowrap">来源</Table.Column>
              <Table.Column className="whitespace-nowrap">平台</Table.Column>
              <Table.Column className="whitespace-nowrap">用户ID</Table.Column>
              <Table.Column className="whitespace-nowrap">邮箱</Table.Column>
              <Table.Column className="whitespace-nowrap">剧集编号</Table.Column>
              <Table.Column className="whitespace-nowrap">支付金额</Table.Column>
              <Table.Column className="whitespace-nowrap">美元金额</Table.Column>
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
                  <Table.Cell className="whitespace-nowrap">{item.platfrom}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.userId}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.email}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    <Tooltip delay={0} >
                      <Link>{item.collectionBizId}</Link>
                      <Tooltip.Content placement="right">
                         <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium flex-shrink-0">原名:</span>
                            <span className="text-muted-foreground truncate">{item.collectionSourceName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium flex-shrink-0">译名:</span>
                            <span className="text-muted-foreground truncate">{item.collectionName}</span>
                          </div>
                      </Tooltip.Content>
                    </Tooltip>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.currency} {item.amount}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">${item.dollar}</Table.Cell>
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
        sizeOptions={[20, 30, 50, 100]}
        onPageChange={(page) => handleSearch({ ...orderListReq, page })}
        onSizeChange={(size) => handleSearch({ ...orderListReq, size })}
      />
    </div>
  )
};
