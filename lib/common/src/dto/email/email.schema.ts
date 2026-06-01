import z from "zod";

export const sendEmailCodeReqSchema = z.object({
    email: z.email({ message: "Email Invalid" }),
});

export const verifyEmailCodeReqSchema = z.object({
    email: z.email({ message: "Email Invalid" }),
    code: z.string().length(6, { message: "Verify Code Invalid" }),
});


export type SendEmailCodeReq = z.infer<typeof sendEmailCodeReqSchema>;
export type VerifyEmailCodeReq = z.infer<typeof verifyEmailCodeReqSchema>;
