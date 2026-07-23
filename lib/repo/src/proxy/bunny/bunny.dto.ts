import { BunnyVideoStatus } from '@lib/common/consts/video';

export type FetchVideoResult = {
    id: string;
    success: boolean;
    message: string;
    statusCode: number;
}

export type GetVideoInfoResult = {
    videoLibraryId: number;
    guid: string;
    status: BunnyVideoStatus;
}
