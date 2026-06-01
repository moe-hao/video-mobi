import { Button, Dropdown, Label, Spinner, type Key } from "@heroui/react";
import { useState } from "react";

interface DownloadButtonProps {
  onConfirm: () => Promise<void>;
  onSuccess?: () => Promise<void>;
}

export default function DownloadButton({ onConfirm, onSuccess }: DownloadButtonProps) {
  const [isClickButton, setIsClickButton] = useState(false);
  const handleAction = async (key: Key) => {
    setIsClickButton(true);
    if (key === "confirm") {
      await onConfirm();
      await onSuccess?.();
    }
    setIsClickButton(false);
  };

  return (
    <Dropdown>
      <Button variant="primary" size="sm" isPending={isClickButton}>
        {isClickButton && <Spinner color="current" size="sm" />}
        下载到服务器
      </Button>
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
