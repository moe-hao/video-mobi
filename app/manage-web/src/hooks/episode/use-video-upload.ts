import { useCallback, useRef, useState } from "react";
import axios from "axios";
import type { Result } from "@lib/common/dto/result";

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
  const params = new URLSearchParams({ collectionBizId, fileName: file.name });
  const token = localStorage.getItem("token") || "";

  const response = await axios.post(`/api/collection_video/upload?${params}`, file, {
    headers: {
      "Authorization": token,
      "Content-Type": "application/octet-stream",
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress(percent);
      }
    },
  });

  const result = response.data as Result;
  if (result.code !== 0) {
    throw new Error(result.message);
  }
}

export function useVideoUpload(collectionBizId: string) {
  const [fileList, setFileList] = useState<UploadFileItem[]>([]);
  const uploadingRef = useRef(false);

  const updateItem = useCallback((index: number, patch: Partial<UploadFileItem>) => {
    setFileList((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }, []);

  const upload = useCallback(
    (files: File[]) => {
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

      (async () => {
        await Promise.all(
          files.map((file, i) =>
            (async () => {
              updateItem(i, { status: "uploading" });
              try {
                await uploadFileWithProgress(file, collectionBizId, (percent) => {
                  updateItem(i, { progress: percent });
                });
                updateItem(i, { status: "done", progress: 100 });
              } catch (err: any) {
                updateItem(i, { status: "error", message: err.message || "上传失败" });
              }
            })()
          )
        );
        uploadingRef.current = false;
      })();
    },
    [collectionBizId, updateItem]
  );

  return { fileList, upload };
}
