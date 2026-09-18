import { useVideoPreview } from "@app/manage-web/hooks/episode/use-video-preview";
import { Link, Modal } from "@heroui/react";
import type { VideoPreviewReq } from "@lib/common/dto/video";
import { useState } from "react";

export function PreviewButton({ id }: { id: number }) {
  const { fetchPreview } = useVideoPreview();
  const [src, setSrc] = useState<string | null>(null);

  const handlePreviewVideo = async (req: VideoPreviewReq) => {
    const result = await fetchPreview(req);
    setSrc(result?.url || null);
  };


  return (
    <Modal>
      <Link className="no-underline hover:underline text-accent mr-2" onClick={() => handlePreviewVideo({ id })}>
        预览
      </Link>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[360px]">
            <Modal.CloseTrigger />
            <Modal.Body>
              {src !== null && (
                <video src={src} controls></video>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
