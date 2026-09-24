import z from "zod";

export const SendEmailCodeReqSchema = z.object({
    email: z.email({ message: "Email Invalid" }),
});

export type SendEmailCodeReq = z.infer<typeof SendEmailCodeReqSchema>;

export const SendEmailCodeRespSchema = z.object({
    verifyCode: z.string(),
});

export type SendEmailCodeResp = z.infer<typeof SendEmailCodeRespSchema>;

export const VerifyEmailCodeReqSchema = z.object({
    email: z.email({ message: "Email Invalid" }),
    code: z.string().length(6, { message: "Verify Code Invalid" }),
});

export type VerifyEmailCodeReq = z.infer<typeof VerifyEmailCodeReqSchema>;
