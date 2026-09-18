import { useCallback, useRef, useState } from "react";
import axios from "axios";
import type { VideoUploadPrepareResp } from "@lib/common/dto/video";
import http from "@lib/common/utils/http/manage";

export interface UploadFileItem {
  name: string;
  epNum: number;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  message?: string;
}

async function uploadFileWithProgress(
  file: File,
  collectionBizId: string,
  onProgress: (percent: number) => void
): Promise<void> {
  const prepareResult = await http.post<VideoUploadPrepareResp>('/api/collection_video/upload_prepare', {
    collectionBizId,
    fileName: file.name,
  });
  const { vid, uploadUrl } = prepareResult.data;

  // 直传 TOS：进度条即真实上传进度（不走业务服务的 token 与拦截器）
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type || "application/octet-stream" },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress(percent);
      }
    },
  });

  await http.post('/api/collection_video/upload_confirm', {
    collectionBizId,
    fileName: file.name,
    vid,
  });
}

export function useVideoUpload(collectionBizId: string) {
  const [fileList, setFileList] = useState<UploadFileItem[]>([]);
  const uploadingRef = useRef(false);

  const updateItem = useCallback((index: number, patch: Partial<UploadFileItem>) => {
    setFileList((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }, []);

  const upload = useCallback(
    async (files: File[], onFileDone?: (epNum: number) => Promise<void> | void): Promise<void> => {
      if (uploadingRef.current || files.length === 0) return;

      files.sort((a, b) => Number(a.name.split(".")[0]) - Number(b.name.split(".")[0]));

      const items: UploadFileItem[] = files.map((file) => ({
        name: file.name,
        epNum: Number(file.name.split(".")[0]),
        progress: 0,
        status: "pending" as const,
      }));
      setFileList(items);
      uploadingRef.current = true;

      await Promise.all(
        files.map((file, i) =>
          (async () => {
            updateItem(i, { status: "uploading" });
            let isSuccess = false;
            try {
              await uploadFileWithProgress(file, collectionBizId, (percent) => {
                updateItem(i, { progress: percent });
              });
              updateItem(i, { status: "done", progress: 100 });
              isSuccess = true;
            } catch (err: any) {
              updateItem(i, { status: "error", message: err.message || "上传失败" });
            }

            if (isSuccess) {
              await onFileDone?.(items[i].epNum);
            }
          })()
        )
      );
      uploadingRef.current = false;
    },
    [collectionBizId, updateItem]
  );

  return { fileList, upload };
}
