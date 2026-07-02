import { useVideoDownload } from "@app/manage-web/hooks/episode/use-video-download";
import { Link, Modal } from "@heroui/react";
import type { VideoDownloadVodReq } from "@lib/common/dto/video";
import { useState } from "react";

export function PreviewButton({ id }: { id: number }) {
  const { fetchDownload } = useVideoDownload();
  const [src, setSrc] = useState<string | null>(null);

  const handlePreviewVideo = async (req: VideoDownloadVodReq) => {
    const result = await fetchDownload(req);
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
