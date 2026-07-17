import { Button, Input, Spinner, Table } from "@heroui/react";
import { useDeletePaymentOption, usePaymentOptionList } from "@app/manage-web/hooks/product";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import type { PaymentOptionListReq } from "@lib/common/dto/payment-option";
import CreateModalButton from "./create-modal-button";
import EditModalButton from "./edit-modal-button";
import DeleteButton from "@app/manage-web/components/delete-button";
import { useToast } from "@app/manage-web/contexts/toast-context";

export default function PaymentOption() {
  const toast = useToast();

  const { paymentOptionListState, fetchPaymentOptionList } = usePaymentOptionList();
  const { fetchDeletePaymentOption } = useDeletePaymentOption();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [req, setReq] = useState<PaymentOptionListReq>({
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 20,
    search: searchParams.get('search') || '',
  });

  const changeSearchParams = (params: PaymentOptionListReq) => {
    setSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
      search: params.search,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchDeletePaymentOption({ id });
    } catch (e) {
      toast.add({ title: "删除失败", description: e instanceof Error ? e.message : "未知错误", variant: "danger" });
    }
  };

  const handleSearch = async (params: PaymentOptionListReq) => {
    setReq(params);
    changeSearchParams(params);
    setLoading(true);
    try {
      await fetchPaymentOptionList(params);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(req);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">支付选项</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Input
            className="w-64"
            aria-label="搜索"
            variant="secondary"
            placeholder="搜索ID/名称"
            value={req.search}
            onChange={(e) => setReq({ ...req, search: e.target.value })}
          />
        </div>
        <Button variant="primary" size="sm" onClick={() => handleSearch({ ...req, page: 1 })}>查询</Button>
        <div className="flex-1"></div>
        <CreateModalButton onSuccess={() => handleSearch(req)} />
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <Spinner size="lg" />
          </div>
        )}
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="payment-option" className="w-max min-w-full">
            <Table.Header>
              <Table.Column className="whitespace-nowrap">ID</Table.Column>
              <Table.Column className="whitespace-nowrap" isRowHeader>选项名称</Table.Column>
              <Table.Column className="whitespace-nowrap">创建时间</Table.Column>
              <Table.Column className="whitespace-nowrap">更新时间</Table.Column>
              <Table.Column className="whitespace-nowrap">操作</Table.Column>
            </Table.Header>
            <Table.Body>
              {paymentOptionListState.list?.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell className="whitespace-nowrap">{item.id}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.name}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.createTime}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.updateTime}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    <EditModalButton item={item} onSuccess={() => handleSearch(req)} />
                    <DeleteButton id={item.id} onConfirm={handleDelete} onSuccess={() => handleSearch(req)} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      </div>
      <TablePagination
        page={req.page || 1}
        size={req.size || 20}
        total={paymentOptionListState.total || 0}
        sizeOptions={[20, 50, 100]}
        onPageChange={(page) => handleSearch({ ...req, page })}
        onSizeChange={(size) => handleSearch({ ...req, size })}
      />
    </div>
  );
}
