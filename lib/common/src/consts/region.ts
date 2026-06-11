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


// PrivateKey:
// MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvwWz+okCKFnlPrazYKHDSS28tSFU5jIu8JTrvzR7A72KKks/Rnd2LNjpOW5gMXxeNC0MSm6zLnfdgTU6uoDGCHTX71Z2QnCQ9nJbANznCwc/GkysrquyQp0LeYhHahCyaCXaxbHIozI0Li6EgBka9//B4mTGq/h+L+LJCb13VAZLtn0D3DFbh5uMzzdgH6quXdBpv3WSpQumtfGa3KOl2fstHryQwf2b4eRpBE0J7XHelWuny8PJmbBxiM2excjd7HkqwUQ8Qbl0v9FZnMlAruUIKTDWTaU5BkLPsvH7AQ1UrsWBASU06hD+FH8WJwGDhjUgLuK6VuJj6EvPYMlplAgMBAAECggEAU78bLIorrqDe1TSwc59xgwMmyrD4yx9JRjGHT9SxnsVycw1ZsUxD0J3aUpQac2qsUizXnPpI8A0pXt33bAYxEQrSOlmjZtDABAulWZn3D/JCCyD9JSWg65yHpGeekj0A87UmtYwzKXWuj53M/PGAq/BUqWJ15ECKz6uFZVqjn2cBkgiOem2SodscWbZ7PMZ6DdkTAjiJvOri9qMWj1qbvBd5GnMvZPvJDI+EmQXpgU0V0dfeMoGZGbO0VA8YE8vztZAUg/kzShFAPEh4RjV3ANlmeEO44aqiMst39u9JnyOJ28vQqgeI4OIcoheSeSfoDzS7N15kWCE0FNFvR+ZMgQKBgQDoy/6p+tVIohyeO2lMsTU4AuyL2SQvhBiBP4XlAnaw42SgSA0U16L6UsdLrbcathCunQCPsCJKW6POWYjE9lXkVfRUQVURvid4NS37mnW6PzTriJRN1qxQvid97kbwrVPUwrAqoRsWaWakT6XN2FJgeWUJU9zLu6gqM2KBHuMgPQKBgQDBRfmla+8SDsDOuAiOuOdvSCqN8E/7OWSDw8sMdSuWmOmo/7qjXVwx0TQkWkhtXB0hep20g+6ZIL7xVdyK5p/Jzb6e0LhyKXr7CRDiXnIsOCE/tAjjyntPk+QnpQLhRyEjnepy3ETIiXm0OhDE5Ms3eGpEMYiQ/A5MsIr3lRhdSQKBgQDDeXdvV5X8FVOechirMymSzLG/hCdkVrEU5jgR4g2z3lzCUX3agG7zbsq1+zoDDdnYJTExdh50/ZoATSIQ8R+SSbKNhQZfjaIqx8zCtiIgr65KEDcnXRj3+5PBpHCg64m233t5cCoEmaB8W/zHadtR8t0qBecik4JTXS5baYohqQKBgFCmtqqFA9pxNZwNx+Rm3IzffIKGiZm4NW2WwqCMNIg/fyH6tRN+3f4b4rpYwmiAS9ewpyaw91wHAicLQWDlJEC+DpGPX6ikDqG7AsSzzMkPEzDWG++SiyqF+GtivHTtjbKjLzaHHFzioVrH8D95iiO3qACU+vwlcoImGZd/LA+hAoGASXp67mZbHc5PxVpHuItPKfhcAM+Mw8vsApEGHh3ejuOIDfVvRiQTTle8fiyMDahwh7Mqi8riVENRSf53YFeX6Ubw/7iX+/3GVUYz4Mww9hlkBgXj/nUVHj3OhlxVcIaQP4NKmMnt1+FZP1OlA+o4oZ8IaYAs5BjUmXgRfkk2Ov8=

// PublicKey:
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr8Fs/qJAihZ5T62s2Chw0ktvLUhVOYyLvCU6780ewO9iipLP0Z3dizY6TluYDF8XjQtDEpusy533YE1OrqAxgh01+9WdkJwkPZyWwDc5wsHPxpMrK6rskKdC3mIR2oQsmgl2sWxyKMyNC4uhIAZGvf/weJkxqv4fi/iyQm9d1QGS7Z9A9wxW4ebjM83YB+qrl3Qab91kqULprXxmtyjpdn7LR68kMH9m+HkaQRNCe1x3pVrp8vDyZmwcYjNnsXI3ex5KsFEPEG5dL/RWZzJQK7lCCkw1k2lOQZCz7Lx+wENVK7FgQElNOoQ/hR/FicBg4Y1IC7iulbiY+hLz2DJaZQIDAQAB
