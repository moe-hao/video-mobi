export enum BunnyVideoStatus {
    Created = 0,
    Uploaded = 1,
    Processing = 2,
    Transcoding = 3,
    Finished = 4,
    Error = 5,
    UploadFailed = 6,
    JitSegmenting = 7,
    JitPlaylistsCreated = 8,
}

export enum VideoUploadStatus {
    Created = 0,
    Succeed = 1,
    Failed = 2,
}
