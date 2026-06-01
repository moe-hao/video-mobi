import z from "zod";

export const adminLoginReqSchema = z.object({
    username: z.string().min(1).max(20),
    password: z.string().min(1).max(20),
});

export const adminChangePasswordReqSchema = z.object({
    oldPassword: z.string().nonempty({ error: "Change Param Invalid" }),
    newPassword: z.string().nonempty({ error: "Change Param Invalid" }),
});

export type AdminLoginReq = z.infer<typeof adminLoginReqSchema>;
export type AdminChangePasswordReq = z.infer<typeof adminChangePasswordReqSchema>;
