import { Dropdown, Label, Link, type Key } from "@heroui/react";

interface UnsubscribeButtonProps {
  id: number;
  onConfirm: (id: number) => Promise<void>;
  onSuccess?: () => Promise<void>;
}

export default function UnsubscribeButton({ id, onConfirm, onSuccess }: UnsubscribeButtonProps) {
  const handleAction = async (key: Key) => {
    if (key === "confirm") {
      await onConfirm(id);
      onSuccess?.();
    }
  };

  return (
    <Dropdown>
      <Link className="no-underline hover:underline text-accent mr-2">退订</Link>
      <Dropdown.Popover>
        <Dropdown.Menu onAction={(key) => handleAction(key)}>
          <Dropdown.Item variant="danger" id="confirm">
            <Label>确认</Label>
          </Dropdown.Item>
          <Dropdown.Item id="cancel">
            <Label>取消</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
