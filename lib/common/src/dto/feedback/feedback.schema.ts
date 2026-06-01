import { FeedbackType } from "@lib/common/consts/feedback";
import z from "zod";

export const feedbackAddReq = z.object({
    email: z.email({ message: "Email Invalid" }),
    feedbackType: z.enum(FeedbackType, { message: "Feedback Type Invalid" }),
    feedbackBusinessId: z.string().default(""),
    description: z.string().min(1, { message: "Description Required" }),
});

export type FeedbackAddReq = z.infer<typeof feedbackAddReq>;
