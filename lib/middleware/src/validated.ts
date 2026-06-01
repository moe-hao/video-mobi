import { zValidator } from "@hono/zod-validator";
import type z from "zod";
import type { ValidationTargets } from "hono";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "@lib/common/consts/result";


export const validated = <T extends z.ZodSchema, Target extends keyof ValidationTargets>(
    target: Target,
    schema: T
) => zValidator(target, schema, (result, c) => {
    if (!result.success) {
        const [issue] = result.error.issues;
        const message = issue.message;
        throw new InternalException(ResultCode.ParameterInvalid.code, message);
    }
})
