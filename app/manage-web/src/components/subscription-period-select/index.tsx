import { Autocomplete, Label, Description, ListBox, EmptyState } from "@heroui/react";
import { SkuPeriodType, SkuPeriodTypeName } from "@lib/common/consts/sku";

export default function SubscriptionPeriodSelect({ className, value, onChange, clearable = true }: { className?: string, value: SkuPeriodType | "", onChange: (period: SkuPeriodType | '') => void, clearable?: boolean }) {
    return (
        <Autocomplete
            aria-label="选择订阅周期"
            className={className}
            variant="secondary"
            placeholder="选择订阅周期"
            selectionMode="single"
            defaultValue={value}
            onChange={(period) => onChange((period ?? '') as SkuPeriodType | '')}
        >
            <Label />
            <Autocomplete.Trigger>
                <Autocomplete.Value />
                {clearable && <Autocomplete.ClearButton />}
                <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Description />
            <Autocomplete.Popover>
                <ListBox renderEmptyState={() => <EmptyState>没有找到订阅周期</EmptyState>}>
                    {Object.entries(SkuPeriodTypeName).map(([key, name]) => (
                        <ListBox.Item key={key} id={key} textValue={name}>
                            <Label>{name}</Label>
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Autocomplete.Popover>
        </Autocomplete>
    )
}
