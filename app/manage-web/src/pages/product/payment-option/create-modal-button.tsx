import { Button, Input, Label, ListBox, Modal, Select } from "@heroui/react";
import { useEffect, useState } from "react";
import { Minus } from "@gravity-ui/icons";
import type { PaymentOptionContentItem } from "@lib/common/dto/payment-option";
import { useAddPaymentOption } from "@app/manage-web/hooks/product";
import { PaymentChannel, PaymentTypeName } from "@lib/common/consts/payment";

export default function CreateModalButton({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [contentList, setContentList] = useState<PaymentOptionContentItem[]>([]);
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
    await fetchAddPaymentOption({ name, content: contentList });
    setIsOpen(false);
    onSuccess?.();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>新建支付组</Button>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog aria-label="新建支付组" className="gray-100 min-w-[600px]">
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
                  暂无支付选项，请点击下方按钮添加
                </div>
              ) : (
                contentList.map((item, index) => (
                  <div key={index} className="flex flex-row items-center gap-4">
                    <Label className="w-14 shrink-0 text-right">支付类型</Label>
                    <Select
                      aria-label="支付类型"
                      variant="secondary"
                      className="flex-1"
                      placeholder="选择支付类型"
                      value={item.paymentType}
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
                      value={item.paymentChannel}
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
                      <Button isIconOnly className="w-4 h-4 min-w-4 rounded-full p-0" variant="danger" onClick={() => setContentList(contentList.filter((_, i) => i !== index))}>
                        <Minus />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" className="w-full" onClick={() => setContentList([...contentList, { paymentType: '', paymentChannel: '' }])}>
                添加选项
              </Button>
              <Button className="w-full" type="submit" onClick={handleAdd}>
                新建
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
