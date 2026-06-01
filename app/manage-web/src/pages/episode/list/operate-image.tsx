import { Plus } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { useRef } from "react";
import type { CollectionCoverUploadResp } from "@lib/common/dto/collection";
import { uploadRequest } from "@lib/common/utils/upload-request";

export default function OperateImage({ cover, setCover }: { cover: string; setCover: (state: string) => void }) {
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    formData.append('file', e.target.files?.[0] || '');
    const data = await uploadRequest<CollectionCoverUploadResp>('/api/collection/upload_cover', formData);
    setCover(data.url);
  };

  return (
    <label className="h-48 w-36 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-600 transition-colors shrink-0 relative group overflow-hidden">
      {cover ? (
        <>
          <img className="h-full w-full object-cover rounded-md" src={cover} />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" onClick={() => coverInputRef.current?.click()}>
              修改
            </Button>
            <Button size="sm" variant="danger-soft" onClick={() => setCover("")}>
              删除
            </Button>
          </div>
        </>
      ) : (
        <Plus className="size-8 text-gray-400" />
      )}
      <input ref={coverInputRef} type="file" className="hidden" accept="image/*" onChange={handleCoverChange} />
    </label>
  );
}
