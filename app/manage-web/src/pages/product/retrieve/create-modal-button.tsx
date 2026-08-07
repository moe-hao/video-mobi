import { Button, Drawer, Input, Label, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import type { RetrieveOptionAddReq } from "@lib/common/dto/retrieve-option";
import { useAddRetrieveOption } from "@app/manage-web/hooks/retrieve-option";
import { useToast } from "@app/manage-web/contexts/toast-context";
import RelationSelect from "@app/manage-web/components/relation-select/relation-select";
import type { RelationType } from "@lib/common/consts/relation";

export default function CreateModalButton({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [addReq, setAddReq] = useState<RetrieveOptionAddReq>({} as RetrieveOptionAddReq);
  const toast = useToast();
  const { fetchAddRetrieveOption } = useAddRetrieveOption();

  useEffect(() => {
    setAddReq({} as RetrieveOptionAddReq);
  }, [isOpen]);

  const handleAdd = async () => {
    try {
      setIsPending(true);
      await fetchAddRetrieveOption(addReq);
      setIsOpen(false);
      onSuccess?.();
      toast.add({ title: "创建成功", variant: "success" });
    } catch (e) {
      toast.add({ title: "创建失败", description: e instanceof Error ? e.message : "未知错误", variant: "danger" });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Drawer isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>新建配置</Button>
      <Drawer.Backdrop isDismissable={false}>
        <Drawer.Content placement="right">
          <Drawer.Dialog aria-label="新建挽留配置" className="w-[600px]">
            <Drawer.CloseTrigger />
            <Drawer.Header className="p-2">
              <Drawer.Heading>新建挽留配置</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">名称</Label>
                <Input variant="secondary" className="flex-1" value={addReq.name || ''} onChange={(e) => setAddReq({ ...addReq, name: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">未付订单</Label>
                <Input variant="secondary" className="flex-1" type="number" value={String(addReq.orderNum || '')} onChange={(e) => setAddReq({ ...addReq, orderNum: Number(e.target.value) })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">打开支付</Label>
                <Input variant="secondary" className="flex-1" type="number" value={String(addReq.openPaymentNum || '')} onChange={(e) => setAddReq({ ...addReq, openPaymentNum: Number(e.target.value) })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">关联关系</Label>
                <RelationSelect className="flex-1" value={addReq.relation as RelationType | ""} onChange={(value) => setAddReq({ ...addReq, relation: value })} />
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Button slot="close" variant="secondary">取消</Button>
              <Button type="submit" isPending={isPending} onClick={handleAdd}>
                {isPending ? <Spinner color="current" size="sm" /> : null}
                新建配置
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
