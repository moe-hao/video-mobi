import z from "zod";

export const guestLoginReqSchema = z.object({
    code: z.string().default(""),
});

export type GuestLoginReq = z.infer<typeof guestLoginReqSchema>;
