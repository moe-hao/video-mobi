import SubscriptionStatusPoint from "@app/manage-web/pages/payment/subscription/subscription-status";
import { Autocomplete, Label, Description, ListBox, EmptyState } from "@heroui/react";
import { SubscriptionStatusList, SubscriptionStatusName, type SubscriptionStatus } from "@lib/common/consts/subscription";

export default function SubscriptionStatusSelect({ className, value, onChange }: { className?: string, value: SubscriptionStatus | "", onChange: (status: SubscriptionStatus | '') => void }) {
  return (
    <Autocomplete
      aria-label="选择订阅状态"
      className={className}
      variant="secondary"
      placeholder="选择订阅状态"
      selectionMode="single"
      defaultValue={value}
      onChange={(status) => onChange((status ?? '') as SubscriptionStatus | '')}
    >
      <Label />
      < Autocomplete.Trigger >
        <Autocomplete.Value />
        < Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      < Description />
      <Autocomplete.Popover>
        <ListBox renderEmptyState={() => <EmptyState>没有找到订阅状态</EmptyState>}>
          {SubscriptionStatusList.map((item) => (
            <ListBox.Item key={item} id={item} textValue={SubscriptionStatusName[item]}>
              <Label><SubscriptionStatusPoint status={item} name={SubscriptionStatusName[item]} /></Label>
              < ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
