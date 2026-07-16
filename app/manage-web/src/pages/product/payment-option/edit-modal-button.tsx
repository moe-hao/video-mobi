import { Button, Input, Label, Link, ListBox, Modal, Select } from "@heroui/react";
import { useEffect, useState } from "react";
import { Minus } from "@gravity-ui/icons";
import type { PaymentOptionEditReq, PaymentOptionContentItem, PaymentOptionListRespItem } from "@lib/common/dto/payment-option";
import { useEditPaymentOption, usePaymentOptionItems } from "@app/manage-web/hooks/product";
import { PaymentChannel, PaymentTypeName } from "@lib/common/consts/payment";

export default function EditModalButton({ item, onSuccess }: { item: PaymentOptionListRespItem, onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editReq, setEditReq] = useState<PaymentOptionEditReq>({} as PaymentOptionEditReq);
  const { fetchEditPaymentOption } = useEditPaymentOption();
  const { fetchPaymentOptionItems } = usePaymentOptionItems();

  useEffect(() => {
    if (isOpen) {
      fetchPaymentOptionItems(item.id).then((items) => {
        setEditReq({
          id: item.id,
          name: item.name,
          content: items,
        });
      });
    }
  }, [isOpen, item]);

  const updateItem = (index: number, field: keyof PaymentOptionContentItem, value: string) => {
    const newContent = editReq.content.map((c, i) => i === index ? { ...c, [field]: value } : c);
    setEditReq({ ...editReq, content: newContent });
  };

  const handleEdit = async () => {
    await fetchEditPaymentOption(editReq);
    setIsOpen(false);
    onSuccess?.();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Link className="no-underline hover:underline text-accent mr-2" onClick={() => setIsOpen(true)}>编辑</Link>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog aria-label="编辑支付组" className="gray-100 min-w-[600px]">
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
                editReq.content?.map((c, index) => (
                  <div key={index} className="flex flex-row items-center gap-4">
                    <Label className="w-14 shrink-0 text-right">支付类型</Label>
                    <Select
                      aria-label="支付类型"
                      variant="secondary"
                      className="flex-1"
                      placeholder="选择支付类型"
                      value={c.paymentType}
                      onChange={(value) => updateItem(index, 'paymentType', value as string)}
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {Object.entries(PaymentTypeName).map(([key, label]) => (
                            <ListBox.Item key={key} id={key} textValue={label}>{label}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                    <Label className="w-14 shrink-0 text-right">支付渠道</Label>
                    <Select
                      aria-label="支付渠道"
                      variant="secondary"
                      className="flex-1"
                      placeholder="选择支付渠道"
                      value={c.paymentChannel}
                      onChange={(value) => updateItem(index, 'paymentChannel', value as string)}
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {Object.values(PaymentChannel).map((channel) => (
                            <ListBox.Item key={channel} id={channel} textValue={channel}>{channel}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                    <div className="w-6 shrink-0">
                      <Button isIconOnly className="w-4 h-4 min-w-4 rounded-full p-0" variant="danger" onClick={() => setEditReq({ ...editReq, content: editReq.content.filter((_, i) => i !== index) })}>
                        <Minus />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" className="w-full" onClick={() => setEditReq({ ...editReq, content: [...editReq.content, { paymentType: '', paymentChannel: '' }] })}>
                添加选项
              </Button>
              <Button className="w-full" type="submit" onClick={handleEdit}>
                确认修改
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
