import { useDeleteSku, useSkuList } from "@app/manage-web/hooks/sku";
import { Button, Input, Table } from "@heroui/react";
import { SkuImportant, SkuType } from "@lib/common/consts/sku";
import { useEffect, useState } from "react";
import CreateModalButton from "./create-modal-button";
import DeleteButton from "@app/manage-web/components/delete-button";
import type { SkuManageListReq } from "@lib/common/dto/sku";
import ProductSelect from "@app/manage-web/components/product-select";
import EditModalButton from "./edit-modal-button";
import TablePagination from "@app/manage-web/components/pagination/pagination";

export default function SkuList() {
  const { skuManageListResp, fetchSkuList } = useSkuList();
  const { fetchDeleteSku } = useDeleteSku();

  const [skuManageListReq, setSkuManageListReq] = useState<SkuManageListReq>({
    page: 1,
    size: 20,
    search: '',
    productId: 0,
  });

  useEffect(() => {
    fetchSkuList(skuManageListReq);
  }, []);

  const handleSearch = async(req: SkuManageListReq) => {
    await fetchSkuList(req);
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
          <ProductSelect className="w-[192px]" value={skuManageListReq.productId} onChange={(productId) => setSkuManageListReq({ ...skuManageListReq, productId })} />
        </div>
        <Button variant="primary" size="sm" onClick={() => handleSearch(skuManageListReq)}>查询</Button>
        <div className="flex-1"></div>
        <CreateModalButton onSuccess={() => handleSearch(skuManageListReq)} />
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Team members" className="w-max min-w-full">
            <Table.Header>
              <Table.Column className="whitespace-nowrap">ID</Table.Column>
              <Table.Column className="whitespace-nowrap" isRowHeader>编号</Table.Column>
              <Table.Column className="whitespace-nowrap">产品域名</Table.Column>
              <Table.Column className="whitespace-nowrap">价格</Table.Column>
              <Table.Column className="whitespace-nowrap">类型</Table.Column>
              <Table.Column className="whitespace-nowrap">权重</Table.Column>
              <Table.Column className="whitespace-nowrap">周期/赠送金币</Table.Column>
              <Table.Column className="whitespace-nowrap">横幅描述</Table.Column>
              <Table.Column className="whitespace-nowrap">重点展示</Table.Column>
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
                  <Table.Cell className="whitespace-nowrap">{item.currency} {item.price}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.skuTypeName}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.weight}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.skuType === SkuType.Subscription ? item.periodTypeName : item.coinBonus}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.desc}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.important === SkuImportant.Yes ? "是" : "否"}</Table.Cell>
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
