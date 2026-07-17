import { Button, Label, ListBox, Select } from "@heroui/react";
import { Grip, Minus } from "@gravity-ui/icons";
import { Reorder } from "framer-motion";
import type { PaymentOptionContentItem } from "@lib/common/dto/payment-option";
import { PaymentChannel, PaymentTypeName } from "@lib/common/consts/payment";

export interface ReorderItem extends PaymentOptionContentItem {
  _id: number;
}

let nextId = 0;

export function toReorderItem(item: PaymentOptionContentItem): ReorderItem {
  return { ...item, _id: nextId++ };
}

export function toContentItem(item: ReorderItem, index: number): PaymentOptionContentItem {
  const { _id, ...rest } = item;
  return { ...rest, sort: index };
}

export default function PaymentOptionItem({ item, index, onUpdate, onRemove }: {
  item: ReorderItem;
  index: number;
  onUpdate: (index: number, field: keyof PaymentOptionContentItem, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <Reorder.Item value={item} className="flex flex-row items-center gap-4">
      <div className="cursor-grab active:cursor-grabbing shrink-0 text-gray-400">
        <Grip />
      </div>
      <Label className="w-14 shrink-0 text-right">支付类型</Label>
      <Select
        aria-label="支付类型"
        variant="secondary"
        className="flex-1"
        placeholder="选择支付类型"
        value={item.paymentType}
        onChange={(value) => onUpdate(index, 'paymentType', value as string)}
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
        onChange={(value) => onUpdate(index, 'paymentChannel', value as string)}
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
        <Button isIconOnly className="w-4 h-4 min-w-4 rounded-full p-0" variant="danger" onClick={() => onRemove(index)}>
          <Minus />
        </Button>
      </div>
    </Reorder.Item>
  );
}
