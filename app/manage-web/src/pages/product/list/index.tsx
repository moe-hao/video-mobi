import { Button, Input, Table } from "@heroui/react";
import { useProductTable } from "@app/manage-web/hooks/product";
import { useEffect, useState } from "react";
import EditModalButton from "./edit-modal-button";
// import DeleteButton from "@app/manage-web/components/delete-button";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import RegionSelect from "@app/manage-web/components/region-select";
import type { ProductListReq } from "@lib/common/dto/product";
import type { Region } from "@lib/common/consts/region";
import CreateModalButton from "./create-modal-button";
import { useSearchParams } from "react-router";

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { productTableState, fetchProductTable } = useProductTable();

  const [productTableReq, setProductTableReq] = useState<ProductListReq>({
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 20,
    search: searchParams.get('search') || '',
    region: (searchParams.get('region') || '') as Region | '',
  });

  const changeSearchParams = (req: ProductListReq) => {
    setSearchParams({
      page: req.page.toString(),
      size: req.size.toString(),
      search: req.search,
      region: req.region,
    });
  };

  const handleSearch = async (req: ProductListReq) => {
    setProductTableReq(req);
    changeSearchParams(req);
    await fetchProductTable(req);
  };

  useEffect(() => {
    fetchProductTable(productTableReq);
    changeSearchParams(productTableReq);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">产品管理</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Input
            aria-label="搜索"
            variant="secondary"
            placeholder="搜索ID/域名"
            value={productTableReq.search}
            onChange={(e) => setProductTableReq({ ...productTableReq, search: e.target.value })}
          />
          <RegionSelect
            className="w-[192px]"
            value={productTableReq.region}
            onChange={(region) => setProductTableReq({ ...productTableReq, region })}
          />
        </div>
        <Button variant="primary" size="sm" onClick={() => handleSearch(productTableReq)}>查询</Button>
        <div className="flex-1"></div>
        <CreateModalButton onSuccess={() => handleSearch(productTableReq)} />
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Team members" className="w-max min-w-full">
            <Table.Header>
              <Table.Column className="whitespace-nowrap">ID</Table.Column>
              <Table.Column className="whitespace-nowrap" isRowHeader>域名</Table.Column>
              <Table.Column className="whitespace-nowrap">地区</Table.Column>
              <Table.Column className="whitespace-nowrap">语言</Table.Column>
              <Table.Column className="whitespace-nowrap">币种</Table.Column>
              <Table.Column className="whitespace-nowrap">货币符号</Table.Column>
              <Table.Column className="whitespace-nowrap">开启金币</Table.Column>
              <Table.Column className="whitespace-nowrap">备注</Table.Column>
              <Table.Column className="whitespace-nowrap">创建时间</Table.Column>
              <Table.Column className="whitespace-nowrap">更新时间</Table.Column>
              <Table.Column>操作</Table.Column>
            </Table.Header>
            <Table.Body>
              {productTableState.list?.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell className="whitespace-nowrap">{item.id}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.host}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.regionName}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.languageName}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.currency}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.currencySign}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.coinUnlock === 1 ? "是" : "否"}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.desc}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.createTime} </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.updateTime}</Table.Cell>
                  <Table.Cell>
                    <EditModalButton product={item} onSuccess={() => handleSearch(productTableReq)} />
                    {/* <DeleteButton id={item.id} onConfirm={(id) => console.log(id)} onSuccess={() => handleSearch(productTableReq)} /> */}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <TablePagination
        page={productTableReq.page || 1}
        size={productTableReq.size || 20}
        total={productTableState.total || 0}
        sizeOptions={[20, 50, 100]}
        onPageChange={(page) => handleSearch({ ...productTableReq, page })}
        onSizeChange={(size) => handleSearch({ ...productTableReq, size })}
      />
    </div>
  )
}
