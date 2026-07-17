import { Button, Input, Link, Spinner, Table, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { useOrderListState } from "@app/manage-web/hooks/payment/use-order-list-state";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import OrderStatusPoint from "./order-status";
import type { OrderListReq } from "@lib/common/dto/order";
import OrderStatusSelect from "@app/manage-web/components/order-select";
import type { OrderStatus } from "@lib/common/consts/order";
import { useSearchParams } from "react-router";
import DateRange, { type DateRangeValue } from "@app/manage-web/components/date-range";
import { SkuType } from "@lib/common/consts/sku";
import ProductMultipleSelect from "@app/manage-web/components/product-select/product-multiple-select";
import OrderTypeSelect from "@app/manage-web/components/order-type-select";
import ColumnSettingsButton from "./column-settings-button";

const ALL_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'bizId', label: '编号' },
  { key: 'host', label: '来源' },
  { key: 'platfrom', label: '平台' },
  { key: 'userId', label: '用户ID' },
  { key: 'email', label: '邮箱' },
  { key: 'amount', label: '支付金额' },
  { key: 'dollar', label: '美元金额' },
  { key: 'orderType', label: '订阅' },
  { key: 'subscriptionCount', label: '订阅期数' },
  { key: 'paymentChennel', label: '支付渠道' },
  { key: 'paymentTypeName', label: '支付方式' },
  { key: 'orderStatus', label: '订单状态' },
   { key: 'collectionBizId', label: '剧集编号' },
  { key: 'collectionSourceName', label: '剧集原名' },
  { key: 'collectionName', label: '剧集译名' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
];

const STORAGE_KEY = 'order-list-visible-columns';

export default function OrderList() {
  const { orderListState, fetchOrderList } = useOrderListState();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialParams = {
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 20,
    search: searchParams.get('search') || '',
    userId: searchParams.get('userId') || '',
    status: searchParams.get('status') || '',
    productId: searchParams.get('productId') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    orderType: searchParams.get('orderType') || '',
    subscriptionCount: searchParams.get('subscriptionCount') || '',
    collectionBizId: searchParams.get('collectionBizId') || '',
  };

  const initDateRange: DateRangeValue | null =
    initialParams.startDate && initialParams.endDate
      ? { start: Number(initialParams.startDate), end: Number(initialParams.endDate) }
      : null;

  const initProductIds: number[] = initialParams.productId
    ? initialParams.productId.split(',').map(Number).filter((id) => !isNaN(id) && id !== 0)
    : [];

  const [orderListReq, setOrderListReq] = useState<OrderListReq>(initialParams);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>(initProductIds);
  const [dateRange, setDateRange] = useState<DateRangeValue | null>(initDateRange);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(searchParams.get('advanced') === 'true');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(ALL_COLUMNS.map((c) => c.key)));

  useEffect(() => {
    setLoading(true);
    fetchOrderList(initialParams).finally(() => setLoading(false));
  }, []);

  const changeSearchParams = (req: OrderListReq, advanced?: boolean) => {
    setSearchParams({
      page: req.page.toString(),
      size: req.size.toString(),
      search: req.search.toString(),
      userId: req.userId.toString(),
      status: req.status.toString(),
      productId: req.productId.toString(),
      orderType: req.orderType.toString(),
      subscriptionCount: req.subscriptionCount.toString(),
      collectionBizId: req.collectionBizId.toString(),
      advanced: (advanced ?? showAdvanced).toString(),
      ...(req.startDate ? { startDate: req.startDate, endDate: req.endDate } : { startDate: "", endDate: "" }),
    });
  }

  const handleSearch = async (req: OrderListReq) => {
    const finalReq = {
      ...req,
      ...(dateRange
        ? { startDate: dateRange.start.toString(), endDate: dateRange.end.toString() }
        : { startDate: "", endDate: "" }),
    };
    changeSearchParams(finalReq);
    setLoading(true);
    try {
      await fetchOrderList(finalReq);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">订单管理</div>
      </div>
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Input aria-label="搜索" variant="secondary" placeholder="搜索订单ID/编号" className="w-64" value={orderListReq.search} onChange={(e) => setOrderListReq({ ...orderListReq, search: e.target.value })} />
          <OrderTypeSelect className="w-64" value={initialParams.orderType as SkuType | ''} onChange={(val) => setOrderListReq({ ...orderListReq, orderType: val })} />
          <OrderStatusSelect className="w-64" value={orderListReq.status ? Number(orderListReq.status) as OrderStatus : ''} onChange={(status) => setOrderListReq({ ...orderListReq, status: status as string })} />
          <DateRange className="w-72" defaultValue={initDateRange} onChange={setDateRange} />
          <Button variant="primary" size="sm" onClick={() => handleSearch(orderListReq)}>查询</Button>
          <Button variant={showAdvanced ? "primary" : "secondary"} size="sm" onClick={() => { const next = !showAdvanced; setShowAdvanced(next); changeSearchParams(orderListReq, next); }}>高级筛选</Button>
          <ColumnSettingsButton columns={ALL_COLUMNS} storageKey={STORAGE_KEY} onChange={setVisibleColumns} />
        </div>
        {showAdvanced && (
        <div className="flex items-center gap-2 flex-wrap">
          <Input aria-label="搜索用户" variant="secondary" placeholder="搜索用户ID" className="w-64" value={orderListReq.userId} onChange={(e) => setOrderListReq({ ...orderListReq, userId: e.target.value })} />
          <Input aria-label="剧集编号" variant="secondary" placeholder="剧集编号" className="w-64" value={orderListReq.collectionBizId} onChange={(e) => setOrderListReq({ ...orderListReq, collectionBizId: e.target.value })} />
          <Input aria-label="订阅期数" variant="secondary" placeholder="订阅期数" className="w-64" value={orderListReq.subscriptionCount} onChange={(e) => setOrderListReq({ ...orderListReq, subscriptionCount: e.target.value })} />
          <ProductMultipleSelect className="w-72" value={selectedProductIds} onChange={(productIds) => { setSelectedProductIds(productIds); setOrderListReq({ ...orderListReq, productId: productIds.join(',') }) }} />
          <div className="flex-1"></div>
        </div>
        )}
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <Spinner size="lg" />
          </div>
        )}
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Team members" className="w-max min-w-full">
              <Table.Header>
                {visibleColumns.has('id') && <Table.Column className="whitespace-nowrap">ID</Table.Column>}
                {visibleColumns.has('bizId') && <Table.Column className="whitespace-nowrap" isRowHeader>编号</Table.Column>}
                {visibleColumns.has('host') && <Table.Column className="whitespace-nowrap">来源</Table.Column>}
                {visibleColumns.has('platfrom') && <Table.Column className="whitespace-nowrap">平台</Table.Column>}
                {visibleColumns.has('userId') && <Table.Column className="whitespace-nowrap">用户ID</Table.Column>}
                {visibleColumns.has('email') && <Table.Column className="whitespace-nowrap">邮箱</Table.Column>}


                {visibleColumns.has('amount') && <Table.Column className="whitespace-nowrap">支付金额</Table.Column>}
                {visibleColumns.has('dollar') && <Table.Column className="whitespace-nowrap">美元金额</Table.Column>}
                {visibleColumns.has('orderType') && <Table.Column className="whitespace-nowrap">订阅</Table.Column>}
                {visibleColumns.has('subscriptionCount') && <Table.Column className="whitespace-nowrap">订阅期数</Table.Column>}
                {visibleColumns.has('paymentChennel') && <Table.Column className="whitespace-nowrap">支付渠道</Table.Column>}
                {visibleColumns.has('paymentTypeName') && <Table.Column className="whitespace-nowrap">支付方式</Table.Column>}
                {visibleColumns.has('orderStatus') && <Table.Column className="whitespace-nowrap">订单状态</Table.Column>}
                {visibleColumns.has('collectionBizId') && <Table.Column className="whitespace-nowrap">剧集编号</Table.Column>}
                {visibleColumns.has('collectionSourceName') && <Table.Column className="whitespace-nowrap">剧集原名</Table.Column>}
                {visibleColumns.has('collectionName') && <Table.Column className="whitespace-nowrap">剧集译名</Table.Column>}
                {visibleColumns.has('createTime') && <Table.Column className="whitespace-nowrap">创建时间</Table.Column>}
                {visibleColumns.has('updateTime') && <Table.Column className="whitespace-nowrap">更新时间</Table.Column>}
              </Table.Header>
              <Table.Body>
                {orderListState.list?.map((item) => (
                  <Table.Row key={item.id}>
                    {visibleColumns.has('id') && <Table.Cell className="whitespace-nowrap">{item.id}</Table.Cell>}
                    {visibleColumns.has('bizId') && (
                      <Table.Cell className="whitespace-nowrap">
                        <Tooltip delay={0} >
                          <Link>{item.bizId}</Link>
                          <Tooltip.Content placement="right">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground truncate">{item.paymentId || '--'}</span>
                            </div>
                          </Tooltip.Content>
                        </Tooltip>
                      </Table.Cell>
                    )}
                    {visibleColumns.has('host') && <Table.Cell className="whitespace-nowrap">{item.host}</Table.Cell>}
                    {visibleColumns.has('platfrom') && <Table.Cell className="whitespace-nowrap">{item.platfrom}</Table.Cell>}
                    {visibleColumns.has('userId') && <Table.Cell className="whitespace-nowrap">{item.userId}</Table.Cell>}
                    {visibleColumns.has('email') && <Table.Cell className="whitespace-nowrap">{item.email}</Table.Cell>}

                    {visibleColumns.has('amount') && <Table.Cell className="whitespace-nowrap">{item.currency} {item.amount}</Table.Cell>}
                    {visibleColumns.has('dollar') && <Table.Cell className="whitespace-nowrap">USD {item.dollar}</Table.Cell>}
                    {visibleColumns.has('orderType') && (
                      <Table.Cell className="whitespace-nowrap">
                        {item.orderType === SkuType.Subscription ? (
                          <Tooltip delay={0} >
                            <Link>{item.orderType === SkuType.Subscription ? '订阅' : '金币'}</Link>
                            <Tooltip.Content placement="right">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground font-medium flex-shrink-0">订阅id:</span>
                                <span className="text-muted-foreground truncate">{item.subscriptionId}</span>
                              </div>
                            </Tooltip.Content>
                          </Tooltip>
                        ) : (
                          <span>金币</span>
                        )}
                      </Table.Cell>
                    )}
                    {visibleColumns.has('subscriptionCount') && <Table.Cell className="whitespace-nowrap">{item.subscriptionCount}</Table.Cell>}
                    {visibleColumns.has('paymentChennel') && <Table.Cell className="whitespace-nowrap">{item.paymentChennel}</Table.Cell>}
                    {visibleColumns.has('paymentTypeName') && <Table.Cell className="whitespace-nowrap">{item.paymentTypeName}</Table.Cell>}
                    {visibleColumns.has('orderStatus') && (
                      <Table.Cell className="whitespace-nowrap">
                        <OrderStatusPoint orderStatus={item.orderStatus} orderStatusName={item.orderStatusName} />
                      </Table.Cell>
                    )}
                    {visibleColumns.has('collectionBizId') && <Table.Cell className="whitespace-nowrap">{item.collectionBizId}</Table.Cell>}
                    {visibleColumns.has('collectionSourceName') && (
                      <Table.Cell className="max-w-[200px]">
                        <Tooltip delay={0}>
                          <Link className="block truncate max-w-[200px]">{item.collectionSourceName}</Link>
                          <Tooltip.Content placement="bottom">
                            <span>{item.collectionSourceName}</span>
                          </Tooltip.Content>
                        </Tooltip>
                      </Table.Cell>
                    )}
                    {visibleColumns.has('collectionName') && (
                      <Table.Cell className="max-w-[200px]">
                        <Tooltip delay={0}>
                          <Link className="block truncate max-w-[200px]">{item.collectionName}</Link>
                          <Tooltip.Content placement="bottom">
                            <span>{item.collectionName}</span>
                          </Tooltip.Content>
                        </Tooltip>
                      </Table.Cell>
                    )}
                    {visibleColumns.has('createTime') && <Table.Cell className="whitespace-nowrap">{item.createTime}</Table.Cell>}
                    {visibleColumns.has('updateTime') && <Table.Cell className="whitespace-nowrap">{item.updateTime}</Table.Cell>}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
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
