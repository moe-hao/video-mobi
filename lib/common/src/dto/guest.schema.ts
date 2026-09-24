import z from "zod";

export const GuestLoginReqSchema = z.object({
    code: z.string().default(""),
});

export type GuestLoginReq = z.infer<typeof GuestLoginReqSchema>;
