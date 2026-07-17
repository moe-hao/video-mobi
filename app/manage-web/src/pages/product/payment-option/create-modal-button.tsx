import { Button, Input, Label, Modal, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import type { PaymentOptionContentItem } from "@lib/common/dto/payment-option";
import { useAddPaymentOption } from "@app/manage-web/hooks/product";
import PaymentOptionItem, { type ReorderItem, toReorderItem, toContentItem } from "./payment-option-item";

export default function CreateModalButton({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [contentList, setContentList] = useState<ReorderItem[]>([]);
  const { fetchAddPaymentOption } = useAddPaymentOption();

  useEffect(() => {
    if (isOpen) {
      setName('');
      setContentList([]);
    }
  }, [isOpen]);

  const updateItem = (index: number, field: keyof PaymentOptionContentItem, value: string) => {
    setContentList(contentList.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      await fetchAddPaymentOption({ name, content: contentList.map(toContentItem) });
      setIsOpen(false);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>新建支付组</Button>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog aria-label="新建支付组" className="gray-100 min-w-[650px]">
            <Modal.CloseTrigger />
            <Modal.Header className="p-2">
              <Modal.Heading>新建支付组</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row items-center gap-4">
                <Label className="w-14 shrink-0">名称</Label>
                <Input variant="secondary" className="flex-1" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              {contentList.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-400">
                  暂无支付选项，请点击下方按钮添加
                </div>
              ) : (
                <Reorder.Group axis="y" values={contentList} onReorder={setContentList} className="flex flex-col gap-4">
                  {contentList.map((item, index) => (
                    <PaymentOptionItem key={item._id} item={item} index={index} onUpdate={updateItem} onRemove={(i) => setContentList(contentList.filter((_, j) => j !== i))} />
                  ))}
                </Reorder.Group>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" className="w-full" onClick={() => setContentList([...contentList, toReorderItem({ paymentType: '', paymentChannel: '' })])}>
                添加选项
              </Button>
              <Button className="w-full" type="submit" isPending={loading} onClick={handleAdd}>
                {({isPending}) => (
                  <>
                    {isPending ? <Spinner color="current" size="sm" /> : null}
                    新建
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
