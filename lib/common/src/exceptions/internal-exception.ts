import type { Result } from "../consts/result";

export class InternalException extends Error {
    code: number;

    constructor(error: Result);
    constructor(code: number, message: string);

    constructor(codeOrError: number | Result, message?: string) {
        if (typeof codeOrError === "object") {
            super(codeOrError.message);
            this.code = codeOrError.code;
        } else {
            super(message!);
            this.code = codeOrError;
        }
    }
}
