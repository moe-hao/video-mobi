import { InternalException } from "@lib/common/exceptions/internal-exception";
import { ResultCode } from "../../consts/result";

export interface Result<T> {
    code: number;
    message: string;
    data: T;
}

export function success<T>(data?: T): Result<T> {
    return {
        code: ResultCode.Success.code,
        message: ResultCode.Success.message,
        data: data || {} as T,
    }
}

export function failed<T>(error: Error, message?: string): Result<T> {
    if (error instanceof InternalException) {
        return {
            code: error.code,
            message: message || error.message,
            data: {} as T,
        }
    }

    return {
        code: ResultCode.InternalServerError.code,
        message: ResultCode.InternalServerError.message,
        data: {} as T,
    }
}
