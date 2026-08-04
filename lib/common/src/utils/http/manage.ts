import { ResultCode } from "@lib/common/consts/result";
import type { Result } from "@lib/common/dto/result";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import axios from "axios";

const http = axios.create({
    validateStatus: (status) => status >= 200 && status < 300,
    timeout: 30000,
});

http.interceptors.request.use(
    (config) => {
        config.headers['content-type'] = 'application/json';
        const token = localStorage.getItem('token');

        if (token) {
            config.headers['authorization'] = token;
        }
        return config;
    }
);

http.interceptors.response.use(
    (response) => {
        if (response.status >= 200 && response.status < 300) {
            if (response.data.code === ResultCode.AuthFailed.code) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                throw new InternalException(response.data.code, response.data.message);
            }

            return response.data;
        } else {
            const result = response.data as Result;
            throw new InternalException(result.code, result.message);
        }
    }
);

export default http;
