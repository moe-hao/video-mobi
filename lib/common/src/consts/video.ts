export const VideoStorage = {
    Vol: "vol",
    Bunny: "bunny",
} as const;

export const VideoUploadStatus = {
    Processing: "processing",
    Success: "success",
    Failed: "failed",
} as const;

export const BunnyVideoStatus = {
    Queued: 0,
    Processing: 1,
    Encoding: 2,
    Finished: 3,
    ResolutionFinished: 4,
    Failed: 5,
    PresignedUploadStarted: 6,
    PresignedUploadFinished: 7,
    PresignedUploadFailed: 8,
    CaptionsGenerated: 9,
    TitleOrDescriptionGenerated: 10,
} as const;
