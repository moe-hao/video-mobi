import { createContext, useContext } from "react";
import type { ProductInfoResp } from "../common/dto/product";
import type { UserAuthInfoResp } from "@lib/common/dto/user";

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
