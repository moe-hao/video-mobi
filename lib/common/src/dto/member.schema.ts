import z from "zod";

export const MemberInfoRespSchema = z.object({
    expireTime: z.number().int(),
    coinNum: z.number().int(),
});

export type MemberInfoResp = z.infer<typeof MemberInfoRespSchema>;
