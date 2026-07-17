import { Button, Input, Label, Link, Modal, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import type { PaymentOptionEditReq, PaymentOptionContentItem, PaymentOptionListRespItem } from "@lib/common/dto/payment-option";
import { useEditPaymentOption, usePaymentOptionItems } from "@app/manage-web/hooks/product";
import { useToast } from "@app/manage-web/contexts/toast-context";
import PaymentOptionItem, { type ReorderItem, toReorderItem, toContentItem } from "./payment-option-item";

interface EditReqState extends Omit<PaymentOptionEditReq, 'content'> {
  content: ReorderItem[];
}

export default function EditModalButton({ item, onSuccess }: { item: PaymentOptionListRespItem, onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editReq, setEditReq] = useState<EditReqState>({} as EditReqState);
  const toast = useToast();
  const { fetchEditPaymentOption } = useEditPaymentOption();
  const { fetchPaymentOptionItems } = usePaymentOptionItems();

  useEffect(() => {
    if (isOpen) {
      fetchPaymentOptionItems(item.id).then((items) => {
        setEditReq({
          id: item.id,
          name: item.name,
          content: items.map(toReorderItem),
        });
      });
    }
  }, [isOpen, item]);

  const updateItem = (index: number, field: keyof PaymentOptionContentItem, value: string) => {
    const newContent = editReq.content.map((c, i) => i === index ? { ...c, [field]: value } : c);
    setEditReq({ ...editReq, content: newContent });
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      await fetchEditPaymentOption({ ...editReq, content: editReq.content.map(toContentItem) });
      setIsOpen(false);
      onSuccess?.();
      toast.add({ title: "编辑成功", variant: "success" });
    } catch (e) {
      toast.add({ title: "编辑失败", description: e instanceof Error ? e.message : "未知错误", variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Link className="no-underline hover:underline text-accent mr-2" onClick={() => setIsOpen(true)}>编辑</Link>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog aria-label="编辑支付组" className="gray-100 min-w-[650px]">
            <Modal.CloseTrigger />
            <Modal.Header className="p-2">
              <Modal.Heading>编辑支付组</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">名称</Label>
                <Input variant="secondary" className="flex-1" value={editReq.name || ''} onChange={(e) => setEditReq({ ...editReq, name: e.target.value })} />
              </div>
              {editReq.content?.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
                  暂无支付选项，请点击下方按钮添加
                </div>
              ) : (
                <Reorder.Group axis="y" values={editReq.content || []} onReorder={(newContent) => setEditReq({ ...editReq, content: newContent })} className="flex flex-col gap-4">
                  {editReq.content?.map((c, index) => (
                    <PaymentOptionItem key={c._id} item={c} index={index} onUpdate={updateItem} onRemove={(i) => setEditReq({ ...editReq, content: editReq.content.filter((_, j) => j !== i) })} />
                  ))}
                </Reorder.Group>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" className="w-full" onClick={() => setEditReq({ ...editReq, content: [...editReq.content, toReorderItem({ paymentType: '', paymentChannel: '' })] })}>
                添加选项
              </Button>
              <Button className="w-full" type="submit" isPending={loading} onClick={handleEdit}>
                {({isPending}) => (
                  <>
                    {isPending ? <Spinner color="current" size="sm" /> : null}
                    确认修改
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
