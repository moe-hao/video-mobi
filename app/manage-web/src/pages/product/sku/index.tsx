import { useDeleteSku, useSkuList } from "@app/manage-web/hooks/sku";
import { Button, Input, Link, Spinner, Table, Tooltip } from "@heroui/react";
import { SkuImportant, SkuType } from "@lib/common/consts/sku";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import CreateModalButton from "./create-modal-button";
import DeleteButton from "@app/manage-web/components/delete-button";
import type { SkuManageListReq } from "@lib/common/dto/sku";
import ProductSelect from "@app/manage-web/components/product-select";
import EditModalButton from "./edit-modal-button";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import { Region, RegionName } from "@lib/common/consts/region";

export default function SkuList() {
  const { skuManageListResp, fetchSkuList } = useSkuList();
  const { fetchDeleteSku } = useDeleteSku();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const [skuManageListReq, setSkuManageListReq] = useState<SkuManageListReq>({
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 20,
    search: searchParams.get('search') || '',
    productId: Number(searchParams.get('productId')) || 0,
  });

  const changeSearchParams = (req: SkuManageListReq) => {
    setSearchParams({
      page: req.page.toString(),
      size: req.size.toString(),
      search: req.search,
      productId: req.productId.toString(),
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchSkuList(skuManageListReq).finally(() => setLoading(false));
    changeSearchParams(skuManageListReq);
  }, []);

  const handleSearch = async (req: SkuManageListReq) => {
    setSkuManageListReq(req);
    changeSearchParams(req);
    setLoading(true);
    try {
      await fetchSkuList(req);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">SKU商品管理</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Input
            aria-label="搜索"
            variant="secondary"
            placeholder="搜索ID/编号"
            value={skuManageListReq.search}
            onChange={(e) => setSkuManageListReq({ ...skuManageListReq, search: e.target.value })}
          />
          <ProductSelect className="w-64" value={skuManageListReq.productId} onChange={(productId) => setSkuManageListReq({ ...skuManageListReq, productId })} />
        </div>
        <Button variant="primary" size="sm" onClick={() => handleSearch(skuManageListReq)}>查询</Button>
        <div className="flex-1"></div>
        <CreateModalButton onSuccess={() => handleSearch(skuManageListReq)} />
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
                <Table.Column className="whitespace-nowrap">ID</Table.Column>
                <Table.Column className="whitespace-nowrap" isRowHeader>编号</Table.Column>
                <Table.Column className="whitespace-nowrap">产品域名</Table.Column>
                <Table.Column className="whitespace-nowrap">展示区域</Table.Column>
                <Table.Column className="whitespace-nowrap">价格</Table.Column>
                <Table.Column className="whitespace-nowrap">类型</Table.Column>
                <Table.Column className="whitespace-nowrap">权重</Table.Column>
                <Table.Column className="whitespace-nowrap">周期/金币</Table.Column>
                <Table.Column className="whitespace-nowrap">周总数/金币赠送</Table.Column>
                <Table.Column className="whitespace-nowrap">横幅描述</Table.Column>
                <Table.Column className="whitespace-nowrap">重点展示</Table.Column>
                <Table.Column className="whitespace-nowrap">支付选项</Table.Column>
                <Table.Column className="whitespace-nowrap">PayPal计划ID</Table.Column>
                <Table.Column className="whitespace-nowrap">创建时间</Table.Column>
                <Table.Column className="whitespace-nowrap">更新时间</Table.Column>
                <Table.Column>操作</Table.Column>
              </Table.Header>
              <Table.Body>
                {skuManageListResp.list?.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell className="whitespace-nowrap">{item.id}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.bizId}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.productHost}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.region ? RegionName[item.region as Region] : '产品范围全部'}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">
                      <Tooltip delay={0} >
                        <Link>{item.currency} {item.price}</Link>
                        <Tooltip.Content placement="right">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground truncate">{item.currencySign} {item.price}</span>
                          </div>
                        </Tooltip.Content>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.skuTypeName}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.weight}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.skuType === SkuType.Subscription ? item.periodTypeName : item.coinNum}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.skuType === SkuType.Subscription ? item.periodTotal : item.coinBonus}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.desc}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.important === SkuImportant.Yes ? "是" : "否"}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.paymentOptionId === 0 ? '' : `[${item.paymentOptionId}] ${item.paymentOptionName}`}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.paypalPlanId}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.createTime} </Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.updateTime}</Table.Cell>
                    <Table.Cell>
                      <EditModalButton sku={item} onSuccess={() => handleSearch(skuManageListReq)} />
                      <DeleteButton id={item.id} onConfirm={(id) => fetchDeleteSku({ id })} onSuccess={() => handleSearch(skuManageListReq)} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
      <TablePagination
        page={skuManageListReq.page || 1}
        size={skuManageListReq.size || 20}
        total={skuManageListResp.total || 0}
        sizeOptions={[20, 50, 100]}
        onPageChange={(page) => handleSearch({ ...skuManageListReq, page })}
        onSizeChange={(size) => handleSearch({ ...skuManageListReq, size })}
      />
    </div>
  )
}
