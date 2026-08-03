import { Autocomplete, Label, Description, ListBox, EmptyState } from "@heroui/react";
import { PaymentChannel } from "@lib/common/consts/payment";

const ChannelList = Object.values(PaymentChannel);

const ChannelName: Record<PaymentChannel, string> = {
    [PaymentChannel.Antom]: 'antom',
    [PaymentChannel.Payermax]: 'payermax',
    [PaymentChannel.Paypal]: 'paypal',
    [PaymentChannel.Payssion]: 'payssion',
};

export default function SubscriptionChannelSelect({ className, value, onChange }: { className?: string, value: PaymentChannel | "", onChange: (channel: PaymentChannel | '') => void }) {
    return (
        <Autocomplete
            aria-label="选择渠道"
            className={className}
            variant="secondary"
            placeholder="选择渠道"
            selectionMode="single"
            defaultValue={value}
            onChange={(channel) => onChange((channel ?? '') as PaymentChannel | '')}
        >
            <Label />
            <Autocomplete.Trigger>
                <Autocomplete.Value />
                <Autocomplete.ClearButton />
                <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Description />
            <Autocomplete.Popover>
                <ListBox renderEmptyState={() => <EmptyState>没有找到订阅渠道</EmptyState>}>
                    {ChannelList.map((item) => (
                        <ListBox.Item key={item} id={item} textValue={ChannelName[item]}>
                            <Label>{ChannelName[item]}</Label>
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Autocomplete.Popover>
        </Autocomplete>
    )
}
