import { Button, Input, Label, Modal } from "@heroui/react";
import { useState } from "react";
import {Minus} from '@gravity-ui/icons';
import { useConfigUnlockEpisodeState } from "@app/manage-web/hooks/episode";

export default function ConfigUnlockButton({ collectionId }: { collectionId: number }) {
  const [configList, setConfigList] = useState<{ epRange: string, unlockCoin: number }[]>([
    { epRange: "", unlockCoin: 0 }
  ]);

  const { fetchConfigUnlockEpisodeVideo } = useConfigUnlockEpisodeState();

  const updateConfigItem = (index: number, field: 'epRange' | 'unlockCoin', value: string | number) => {
    setConfigList(configList.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleConfirm = async () => {
    const result: { epNum: number, unlockCoin: number }[] = [];

    configList.forEach((item) => {
      const epRange = item.epRange.trim();
      const unlockCoin = Number(item.unlockCoin);

      if (epRange.includes('-')) {
        // 范围模式: "5-10" -> 5,6,7,8,9,10
        const [start, end] = epRange.split('-').map(Number);
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
          result.push({ epNum: i, unlockCoin });
        }
      } else if (epRange !== '') {
        // 单集模式: "5" -> 只有第5集
        result.push({ epNum: Number(epRange), unlockCoin });
      }
    });

    await fetchConfigUnlockEpisodeVideo({ collectionId, configList: result });
  }

  return (
    <Modal>
      <Button variant="primary">配置解锁金币</Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>配置解锁金币</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {
                configList.map((item, index) => (
                  <div key={index} className="flex flex-row items-center gap-4 mb-2">
                    <Label className="w-10 shrink-0  text-right">集数</Label>
                    <Input variant="secondary" className="w-full" placeholder="5-10" value={item.epRange} onChange={(e) => updateConfigItem(index, 'epRange', e.target.value)} />
                    <Label className="w-16 shrink-0  text-right">解锁金币: </Label>
                    <Input variant="secondary" className="w-full" type="number" placeholder="10" value={item.unlockCoin} onChange={(e) => updateConfigItem(index, 'unlockCoin', Number(e.target.value))} />
                    <div className="w-6 shrink-0">
                      {index > 0 && (
                        <Button isIconOnly className="w-4 h-4 min-w-4 rounded-full p-0" variant="danger" onClick={() => setConfigList(configList.filter((i) => i !== item))}>
                          <Minus />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" className="w-full" onClick={() => setConfigList([...configList, { epRange: "", unlockCoin: 0 }])}>
                添加配置
              </Button>
              <Button className="w-full" slot="close" onClick={handleConfirm}>
                确认
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
