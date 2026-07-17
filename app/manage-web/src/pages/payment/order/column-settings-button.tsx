import { Button, ListBox, Popover, type Selection } from "@heroui/react";
import { Gear } from "@gravity-ui/icons";
import { useEffect, useState } from "react";

export interface ColumnDef {
  key: string;
  label: string;
}

export default function ColumnSettingsButton({ columns, storageKey, onChange }: {
  columns: ColumnDef[];
  storageKey: string;
  onChange: (visibleColumns: Set<string>) => void;
}) {
  const defaultKeys = columns.map((c) => c.key);

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return new Set(JSON.parse(stored));
    } catch {}
    return new Set(defaultKeys);
  });

  useEffect(() => {
    onChange(visibleColumns);
  }, [visibleColumns]);

  const handleChange = (keys: Selection) => {
    let next: Set<string>;
    if (keys === 'all') {
      next = new Set(defaultKeys);
    } else {
      const strKeys = new Set([...keys].map(String));
      next = strKeys.size > 0 ? strKeys : visibleColumns;
    }
    setVisibleColumns(next);
    localStorage.setItem(storageKey, JSON.stringify([...next]));
  };

  return (
    <Popover>
      <Popover.Trigger>
        <Button variant="secondary" size="sm"> <Gear className="size-4" /> 显示列</Button>
      </Popover.Trigger>
      <Popover.Content placement="bottom end">
        <ListBox
          aria-label="选择显示列"
          selectionMode="multiple"
          selectedKeys={visibleColumns}
          onSelectionChange={handleChange}
        >
          {columns.map((col) => (
            <ListBox.Item key={col.key} id={col.key} textValue={col.label}>
              {col.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Popover.Content>
    </Popover>
  );
}
