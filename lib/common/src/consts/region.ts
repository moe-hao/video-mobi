export enum Region {
    US = "US",
    BR = "BR",
    JP = "JP",
    TW = "TW",
    CLP = "CLP",
    COP = "COP",
    MXN = "MXN",
    PEN = "PEN",
    PYG = "PYG",
    ARS = "ARS",
    USD = "USD",
    UYU = "UYU",
    CRC = "CRC",
}

export const RegionName: Record<Region, string> = {
    [Region.US]: "美国",
    [Region.BR]: "巴西",
    [Region.JP]: "日本",
    [Region.TW]: "台湾",
    [Region.CLP]: "智利",
    [Region.COP]: "哥伦比亚",
    [Region.MXN]: "墨西哥",
    [Region.PEN]: "秘鲁",
    [Region.PYG]: "危地马拉",
    [Region.ARS]: "阿根廷",
    [Region.USD]: "美元",
    [Region.UYU]: "乌拉圭",
    [Region.CRC]: "哥斯达黎加",
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
