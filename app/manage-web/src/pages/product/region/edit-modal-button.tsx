import { Button, Input, Label, Link, Modal, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import type { RegionEditReq, RegionListItem } from "@lib/common/dto/region";
import { useEditRegion } from "@app/manage-web/hooks/region";
import { useToast } from "@app/manage-web/contexts/toast-context";

export default function EditModalButton({ item, onSuccess }: { item: RegionListItem, onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [req, setReq] = useState<RegionEditReq>({} as RegionEditReq);
  const toast = useToast();
  const { fetchEditRegion } = useEditRegion();

  useEffect(() => {
    if (isOpen) {
      setReq({
        id: item.id,
        name: item.name,
        currency: item.currency,
        currencySign: item.currencySign,
      });
    }
  }, [isOpen, item]);

  const handleEdit = async () => {
    try {
      setIsPending(true);
      await fetchEditRegion(req);
      setIsOpen(false);
      onSuccess?.();
      toast.add({ title: "编辑成功", variant: "success" });
    } catch (e) {
      toast.add({ title: "编辑失败", description: e instanceof Error ? e.message : "未知错误", variant: "danger" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Link className="no-underline hover:underline text-accent mr-2" onClick={() => setIsOpen(true)}>编辑</Link>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="md">
          <Modal.Dialog aria-label="编辑地区" className="gray-100 min-w-[400px]">
            <Modal.CloseTrigger />
            <Modal.Header className="p-2">
              <Modal.Heading>编辑地区 {item.id}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">名称</Label>
                <Input variant="secondary" className="flex-1" placeholder="输入地区名称" value={req.name || ''} onChange={(e) => setReq({ ...req, name: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">货币</Label>
                <Input variant="secondary" className="flex-1" placeholder="如 USD" value={req.currency || ''} onChange={(e) => setReq({ ...req, currency: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">货币符号</Label>
                <Input variant="secondary" className="flex-1" placeholder="如 $" value={req.currencySign || ''} onChange={(e) => setReq({ ...req, currencySign: e.target.value })} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" isPending={isPending} onClick={handleEdit}>
                {isPending ? <Spinner color="current" size="sm" /> : null}
                确认修改
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
