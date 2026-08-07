import { Button, Input, Table } from "@heroui/react";
import { useRetrieveOptionTable, useDeleteRetrieveOption } from "@app/manage-web/hooks/retrieve-option";
import { useEffect, useState } from "react";
import EditModalButton from "./edit-modal-button";
import DeleteButton from "@app/manage-web/components/delete-button";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import CreateModalButton from "./create-modal-button";
import type { RetrieveOptionListReq } from "@lib/common/dto/retrieve-option";
import { useSearchParams } from "react-router";

export default function RetrieveOptionList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { retrieveOptionTableState, fetchRetrieveOptionTable } = useRetrieveOptionTable();
  const { fetchDeleteRetrieveOption } = useDeleteRetrieveOption();

  const [req, setReq] = useState<RetrieveOptionListReq>({
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 20,
    search: searchParams.get('search') || '',
  });

  const changeSearchParams = (r: RetrieveOptionListReq) => {
    setSearchParams({
      page: r.page.toString(),
      size: r.size.toString(),
      search: r.search,
    });
  };

  const handleSearch = async (r: RetrieveOptionListReq) => {
    setReq(r);
    changeSearchParams(r);
    await fetchRetrieveOptionTable(r);
  };

  useEffect(() => {
    fetchRetrieveOptionTable(req);
    changeSearchParams(req);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">挽留配置</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Input
            aria-label="搜索"
            variant="secondary"
            className="w-64"
            placeholder="搜索ID/名称/关联"
            value={req.search}
            onChange={(e) => setReq({ ...req, search: e.target.value })}
          />
        </div>
        <Button variant="primary" size="sm" onClick={() => handleSearch(req)}>查询</Button>
        <div className="flex-1"></div>
        <CreateModalButton onSuccess={() => handleSearch(req)} />
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="挽留配置列表" className="w-max min-w-full">
            <Table.Header>
              <Table.Column className="whitespace-nowrap">ID</Table.Column>
              <Table.Column className="whitespace-nowrap" isRowHeader>名称</Table.Column>
              <Table.Column className="whitespace-nowrap">未付订单</Table.Column>
              <Table.Column className="whitespace-nowrap">打开支付</Table.Column>
              <Table.Column className="whitespace-nowrap">关联关系</Table.Column>
              <Table.Column className="whitespace-nowrap">创建时间</Table.Column>
              <Table.Column className="whitespace-nowrap">更新时间</Table.Column>
              <Table.Column>操作</Table.Column>
            </Table.Header>
            <Table.Body>
              {retrieveOptionTableState.list?.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell className="whitespace-nowrap">{item.id}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.name}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.orderNum}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.openPaymentNum}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.relationName}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.createTime}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.updateTime}</Table.Cell>
                  <Table.Cell>
                    <EditModalButton item={item} onSuccess={() => handleSearch(req)} />
                    <DeleteButton id={item.id} onConfirm={fetchDeleteRetrieveOption} onSuccess={() => handleSearch(req)} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <TablePagination
        page={req.page || 1}
        size={req.size || 20}
        total={retrieveOptionTableState.total || 0}
        sizeOptions={[20, 50, 100]}
        onPageChange={(page) => handleSearch({ ...req, page })}
        onSizeChange={(size) => handleSearch({ ...req, size })}
      />
    </div>
  )
}
