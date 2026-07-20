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
}

export type RegionInfo = {
    name: string;
    currency: string;
    currencySign: string;
}

export const RegionInfoRecord: Record<Region, RegionInfo> = {
    [Region.US]: {
        name: "美国",
        currency: "USD",
        currencySign: "$",
    },
    [Region.BR]: {
        name: "巴西",
        currency: "BRL",
        currencySign: "R$",
    },
    [Region.JP]: {
        name: "日本",
        currency: "JPY",
        currencySign: "¥",
    },
    [Region.TW]: {
        name: "台湾",
        currency: "TWD",
        currencySign: "NT$",
    },
    [Region.CL]: {
        name: "智利",
        currency: "CLP",
        currencySign: "CLP$",
    },
    [Region.CO]: {
        name: "哥伦比亚",
        currency: "COP",
        currencySign: "COP$",
    },
    [Region.MX]: {
        name: "墨西哥",
        currency: "MXN",
        currencySign: "MXN$",
    },
    [Region.PE]: {
        name: "秘鲁",
        currency: "PEN",
        currencySign: "S/",
    },
    [Region.PY]: {
        name: "巴拉圭",
        currency: "PYG",
        currencySign: "₲",
    },
    [Region.AR]: {
        name: "阿根廷",
        currency: "ARS",
        currencySign: "$",
    },
    [Region.PA]: {
        name: "巴拿马",
        currency: "PAB",
        currencySign: "$",
    },
    [Region.UY]: {
        name: "乌拉圭",
        currency: "UYU",
        currencySign: "$U",
    },
    [Region.CR]: {
        name: "哥斯达黎加",
        currency: "CRC",
        currencySign: "$",
    },
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
