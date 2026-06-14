import { Dropdown, Label, Link, type Key } from "@heroui/react";

interface DeleteButtonProps {
  id: number;
  onConfirm: (id: number) => Promise<void>;
  onSuccess?: () => Promise<void>;
}

export default function DeleteButton({ id, onConfirm, onSuccess }: DeleteButtonProps) {
  const handleAction = async (key: Key) => {
    if (key === "confirm") {
      await onConfirm(id);
      onSuccess?.();
    }
  };

  return (
    <Dropdown>
      <Link className="no-underline hover:underline text-red-500 mr-2">删除</Link>
      <Dropdown.Popover>
        <Dropdown.Menu onAction={(key) => handleAction(key)}>
          <Dropdown.Item variant="danger" id="confirm">
            <Label>确认删除</Label>
          </Dropdown.Item>
          <Dropdown.Item id="cancel">
            <Label>取消删除</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
