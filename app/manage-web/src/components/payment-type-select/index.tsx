import { Autocomplete, Label, Description, ListBox, EmptyState } from "@heroui/react";
import { PaymentType, PaymentTypeName } from "@lib/common/consts/payment";

const TypeList = Object.values(PaymentType);

export default function PaymentTypeSelect({ className, value, onChange }: { className?: string, value: PaymentType | "", onChange: (type: PaymentType | '') => void }) {
    return (
        <Autocomplete
            aria-label="选择支付类型"
            className={className}
            variant="secondary"
            placeholder="选择支付类型"
            selectionMode="single"
            defaultValue={value}
            onChange={(type) => onChange((type ?? '') as PaymentType | '')}
        >
            <Label />
            <Autocomplete.Trigger>
                <Autocomplete.Value />
                <Autocomplete.ClearButton />
                <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Description />
            <Autocomplete.Popover>
                <ListBox renderEmptyState={() => <EmptyState>没有找到支付类型</EmptyState>}>
                    {TypeList.map((item) => (
                        <ListBox.Item key={item} id={item} textValue={PaymentTypeName[item]}>
                            <Label>{PaymentTypeName[item]}</Label>
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Autocomplete.Popover>
        </Autocomplete>
    )
}
