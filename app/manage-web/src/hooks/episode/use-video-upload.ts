import { useCallback, useRef, useState } from "react";
import type { Result } from "@lib/common/dto/result";

export interface UploadFileItem {
  name: string;
  epNum: number;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  message?: string;
}

function uploadFileWithProgress(
  file: File,
  collectionBizId: string,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("collectionBizId", collectionBizId);
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const result = JSON.parse(xhr.responseText) as Result;
        if (result.code !== 0) {
          reject(new Error(result.message));
        } else {
          resolve();
        }
      } catch {
        reject(new Error("响应解析失败"));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("网络错误")));
    xhr.addEventListener("abort", () => reject(new Error("已取消")));

    xhr.open("POST", "/api/collection_video/upload");
    xhr.setRequestHeader("Authorization", localStorage.getItem("token") || "");
    xhr.send(formData);
  });
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
