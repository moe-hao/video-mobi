export enum Region {
    US = "US",
    BR = "BR",
    JP = "JP",
    TW = "TW",
    CL = "CL",
    CO = "CO",
    MX = "MX",
    PE = "PE",
    PY = "PY",
    AR = "AR",
    PA = "PA",
    UY = "UY",
    CR = "CR",
    ES = "ES",
    DO = "DO",
}

export const RegionName: Record<Region, string> = {
    [Region.US]: "美国",
    [Region.BR]: "巴西",
    [Region.JP]: "日本",
    [Region.TW]: "台湾",
    [Region.CL]: "智利",
    [Region.CO]: "哥伦比亚",
    [Region.MX]: "墨西哥",
    [Region.PE]: "秘鲁",
    [Region.PY]: "巴拉圭",
    [Region.AR]: "阿根廷",
    [Region.PA]: "巴拿马",
    [Region.UY]: "乌拉圭",
    [Region.CR]: "哥斯达黎加",
    [Region.ES]: "西班牙",
    [Region.DO]: "多米尼加",
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
