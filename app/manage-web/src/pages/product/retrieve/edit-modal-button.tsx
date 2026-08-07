import { Button, Drawer, Input, Label, Link, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import type { RetrieveOptionEditReq, RetrieveOptionListRespItem } from "@lib/common/dto/retrieve-option";
import { useEditRetrieveOption } from "@app/manage-web/hooks/retrieve-option";
import { useToast } from "@app/manage-web/contexts/toast-context";
import RelationSelect from "@app/manage-web/components/relation-select/relation-select";
import type { RelationType } from "@lib/common/consts/relation";

export default function EditModalButton({ item, onSuccess }: { item: RetrieveOptionListRespItem, onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [editReq, setEditReq] = useState({} as RetrieveOptionEditReq);
  const toast = useToast();
  const { fetchEditRetrieveOption } = useEditRetrieveOption();

  useEffect(() => {
    setEditReq({
      id: item.id,
      name: item.name,
      orderNum: item.orderNum,
      openPaymentNum: item.openPaymentNum,
      relation: item.relation,
    });
  }, [isOpen, item]);

  const handleEdit = async () => {
    try {
      setIsPending(true);
      await fetchEditRetrieveOption(editReq);
      setIsOpen(false);
      onSuccess?.();
      toast.add({ title: "编辑成功", variant: "success" });
    } catch (e) {
      toast.add({ title: "编辑失败", description: e instanceof Error ? e.message : "未知错误", variant: "danger" });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Drawer isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Link className="no-underline hover:underline text-accent mr-2" onClick={() => setIsOpen(true)}>编辑</Link>
      <Drawer.Backdrop isDismissable={false}>
        <Drawer.Content placement="right">
          <Drawer.Dialog aria-label="编辑挽留配置" className="w-[600px]">
            <Drawer.CloseTrigger />
            <Drawer.Header className="p-2">
              <Drawer.Heading>编辑挽留配置</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="flex flex-col gap-4 p-2">
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">名称</Label>
                <Input variant="secondary" className="flex-1" value={editReq.name || ''} onChange={(e) => setEditReq({ ...editReq, name: e.target.value })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">未付订单</Label>
                <Input variant="secondary" className="flex-1" type="number" value={String(editReq.orderNum || '')} onChange={(e) => setEditReq({ ...editReq, orderNum: Number(e.target.value) })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">打开支付</Label>
                <Input variant="secondary" className="flex-1" type="number" value={String(editReq.openPaymentNum || '')} onChange={(e) => setEditReq({ ...editReq, openPaymentNum: Number(e.target.value) })} />
              </div>
              <div className="flex flex-row items-center gap-4">
                <Label className="w-18 shrink-0 text-right">关联关系</Label>
                <RelationSelect className="flex-1" value={editReq.relation as RelationType | ""} onChange={(value) => setEditReq({ ...editReq, relation: value })} />
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Button slot="close" variant="secondary">取消</Button>
              <Button type="submit" isPending={isPending} onClick={handleEdit}>
                {isPending ? <Spinner color="current" size="sm" /> : null}
                确认修改
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
