import { createContext, useContext } from "react";
import type { UserAuthInfoResp } from "@lib/common/dto/user.schema";
import type { ProductInfoResp } from "@lib/common/dto/product.schema";

interface VideoMobiContextType {
  userInfo: UserAuthInfoResp | undefined;
  productInfo: ProductInfoResp | undefined;
}

const defaultContext: VideoMobiContextType = {
  userInfo: undefined,
  productInfo: undefined,
};

export const VideoMobiContext = createContext<VideoMobiContextType>(defaultContext);
export const useVideoMobiContext = () => useContext(VideoMobiContext);
