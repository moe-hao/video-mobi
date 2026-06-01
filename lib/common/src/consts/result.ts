export type Result = {
    code: number;
    message: string;
}

export const ResultCode = {
    Success: {
        code: 0,
        message: "success",
    },
    InternalServerError: {
        code: 10000,
        message: "Internal Server Error",
    },
    ParameterInvalid: {
        code: 10001,
        message: "Parameter Invalid",
    },
    AuthLoginFailed: {
        code: 20001,
        message: "Auth Login Failed",
    },
    AuthFailed: {
        code: 20002,
        message: "Auth Failed",
    },
    DecryptError: {
        code: 20003,
        message: "Decrypt Error",
    },
    ResourceNotFound: {
        code: 20004,
        message: "Resource Not Found"
    },
    MethodNotSupported: {
        code: 30002,
        message: "Method Not Supported"
    },
    ChannelNotSupported: {
        code: 30003,
        message: "Channel Not Supported"
    },
    PayermaxFailed: {
        code: 30004,
        message: "Payermax Failed"
    },
}
