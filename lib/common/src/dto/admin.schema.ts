import z from "zod";

export const AdminLoginReqSchema = z.object({
    username: z.string().min(1).max(20),
    password: z.string().min(1).max(20),
});

export type AdminLoginReq = z.infer<typeof AdminLoginReqSchema>;

export const AdminLoginRespSchema = z.object({
    token: z.string(),
});

export type AdminLoginResp = z.infer<typeof AdminLoginRespSchema>;

export const AdminInfoRespSchema = z.object({
    username: z.string(),
});

export type AdminInfoResp = z.infer<typeof AdminInfoRespSchema>;

export const AdminChangePasswordReqSchema = z.object({
    oldPassword: z.string().nonempty({ error: "Change Param Invalid" }),
    newPassword: z.string().nonempty({ error: "Change Param Invalid" }),
});

export type AdminChangePasswordReq = z.infer<typeof AdminChangePasswordReqSchema>;


