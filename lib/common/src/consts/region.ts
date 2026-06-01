export enum Region {
    US = "US",
    BR = "BR",
    JP = "JP",
    TW = "TW",
}

export const RegionName: Record<Region, string> = {
    [Region.US]: "美国",
    [Region.BR]: "巴西",
    [Region.JP]: "日本",
    [Region.TW]: "台湾",
}

export enum Language {
    Jp = "ja",
    Ko = "ko",
    En = "en",
    Es = "es",
    Pt = "pt",
    ZhTw = "zh-TW",
}


export const LanguageName: Record<Language, string> = {
    [Language.En]: "英语",
    [Language.Pt]: "葡萄牙语",
    [Language.ZhTw]: "繁体中文",
    [Language.Jp]: "日语",
    [Language.Ko]: "韩语",
    [Language.Es]: "西班牙语",
}
