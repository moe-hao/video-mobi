import { Autocomplete, Label, ListBox } from "@heroui/react";

export const PlatformName: Record<number, string> = {
  1: 'Facebook',
  2: 'TikTok',
};

export default function PlatformSelect({ className, value, onChange }: { className?: string, value: string, onChange: (platform: string) => void }) {
  return (
    <Autocomplete
      aria-label="选择平台"
      className={className}
      variant="secondary"
      placeholder="选择平台"
      selectionMode="single"
      defaultValue={value}
      onChange={(platform) => onChange(platform?.toString() || '')}
    >
      <Label />
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <ListBox>
        {Object.entries(PlatformName).map(([key, name]) => (
          <ListBox.Item key={key} id={key} textValue={name}>
            <Label>{name}</Label>
            <ListBox.ItemIndicator />
          </ListBox.Item>
        ))}
      </ListBox>
    </Autocomplete>
  )
}
