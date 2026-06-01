import { ResultCode } from "../consts/result";
import type { Result } from "../dto/result";
import type { UserAuthLoginResp } from "../dto/user";
import { InternalException } from "../exceptions/internal-exception";


type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT';

let refreshPromise: Promise<UserAuthLoginResp> | null = null;

async function refreshGuestLogin(): Promise<UserAuthLoginResp> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const guestLoginResp = await fetch('/api/auth/guest_login?with=request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: '' }),
            });

            const guestLoginResult = await guestLoginResp.json() as Result<UserAuthLoginResp>;
            if (guestLoginResult.code !== ResultCode.Success.code) {
                throw new InternalException(guestLoginResult.code, guestLoginResult.message);
            }

            localStorage.setItem("auth", guestLoginResult.data.authToken);
            return guestLoginResult.data;
        })();
    }
    return refreshPromise;
}

export async function request<ResponseType = undefined>(url: string, method: RequestMethod, body?: any): Promise<ResponseType> {
    const requestHeader: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    const authToken = localStorage.getItem("auth");
    if (authToken) {
        requestHeader['Authorization'] = `${authToken}`;
    }

    const request = {
        method: method,
        headers: requestHeader,
        credentials: 'include' as RequestCredentials,
        body: body ? JSON.stringify(body) : undefined,
    }

    const resp = await fetch(url, request)
    if (!resp.ok) {
        throw new InternalException(resp.status, resp.statusText);
    }

    const result = await resp.json() as Result<ResponseType>;
    if (result.code !== ResultCode.Success.code) {
        if (result.code === ResultCode.AuthFailed.code) {
            await refreshGuestLogin();
            window.location.reload();
        }
        throw new InternalException(result.code, result.message);
    }

    return result.data;
}
