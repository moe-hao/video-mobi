import { Select, ListBox } from "@heroui/react";
import { Language, LanguageName } from "@lib/common/consts/region";

export default function LanguageSelect({ className, language, onChange }: { className?: string; language: Language; onChange: (value: Language) => void }) {
  return (
    <Select
      aria-label="选择语言"
      variant="secondary"
      className={className}
      placeholder="选择语言"
      value={language || ""}
      onChange={(value) => onChange(value as Language)}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {
            Object.values(Language).map((item) => (
              <ListBox.Item key={item} id={item} textValue={LanguageName[item]}>{LanguageName[item]}</ListBox.Item>
            ))
          }
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
