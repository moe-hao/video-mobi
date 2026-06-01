import { Table } from "@heroui/react";
import { useProductTable } from "@app/manage-web/hooks/product";
import { useEffect } from "react";
import EditModalButton from "./edit-modal-button";
import DeleteButton from "@app/manage-web/components/delete-button";
import TablePagination from "@app/manage-web/components/pagination/pagination";

export default function ProductList() {
  const { productTableState, fetchProductTable } = useProductTable();

  useEffect(() => {
    fetchProductTable();
  }, [fetchProductTable]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">产品管理</div>
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
                  <Table.Cell className="whitespace-nowrap">{item.createTime} </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.updateTime}</Table.Cell>
                  <Table.Cell>
                    <EditModalButton product={item} />
                    <DeleteButton id={item.id} onConfirm={(id) => console.log(id)} onSuccess={() => fetchProductTable()} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <TablePagination
        page={productTableState.page || 1}
        size={productTableState.size || 10}
        total={productTableState.total || 0}
        onPageChange={() => fetchProductTable()}
      />
    </div>
  )
}
