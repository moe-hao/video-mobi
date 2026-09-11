import { Button, Drawer, ProgressBar, Spinner, Table } from "@heroui/react";
import { useRef, useState } from "react";
import { useVideoUpload } from "@app/manage-web/hooks/episode/use-video-upload";

export default function UploadButton({ collectionBizId }: { collectionBizId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fileList, upload } = useVideoUpload(collectionBizId);

  const handleFileChange = (files: File[]) => {
    upload(files);
  };

  return (
    <Drawer isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>上传视频</Button>
      <Drawer.Backdrop isDismissable={false}>
        <Drawer.Content placement="right">
          <Drawer.Dialog aria-label="上传视频" className="w-[600px]">
            <Drawer.CloseTrigger />
            <Drawer.Header className="p-2">
              <Drawer.Heading>上传视频</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="flex flex-col gap-4 p-2">
              <div className="flex justify-end">
                <Button variant="primary" size="sm" onClick={() => fileInputRef.current?.click()}>选择视频</Button>
                <input ref={fileInputRef} type="file" className="hidden" accept="video/*" multiple onChange={(e) => handleFileChange(Array.from(e.target.files || []))} />
              </div>
              <div>
                <Table>
                  <Table.ScrollContainer>
                    <Table.Content aria-label="upload-list" className="w-full">
                      <Table.Header>
                        <Table.Column isRowHeader>文件</Table.Column>
                        <Table.Column>集数</Table.Column>
                        <Table.Column>进度</Table.Column>
                      </Table.Header>
                      <Table.Body>
                        {fileList.map((item, index) => (
                          <Table.Row key={`${item.name}-${index}`}>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.epNum}</Table.Cell>
                            <Table.Cell>
                              {item.status === "done" ? (
                                <span>已完成</span>
                              ) : item.status === "error" ? (
                                <span className="text-danger">{item.message || "失败"}</span>
                              ) : item.progress >= 100 ? (
                                <Spinner size="sm" color="current" />
                              ) : (
                                <ProgressBar aria-label="upload-progress" size="sm" value={item.progress}>
                                  <ProgressBar.Output />
                                  <ProgressBar.Track>
                                    <ProgressBar.Fill />
                                  </ProgressBar.Track>
                                </ProgressBar>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
              </div>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
