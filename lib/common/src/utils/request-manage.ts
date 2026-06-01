import type { Result } from "../dto/result";
import { InternalException } from "../exceptions/internal-exception";

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT';

export async function request<ResponseType = undefined>(url: string, method: RequestMethod, body?: any): Promise<ResponseType> {
    const requestHeader: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    const token = localStorage.getItem('token');
    if (token) {
        requestHeader['Authorization'] = token;
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
    if (result.code !== 0) {
        throw new InternalException(result.code, result.message);
    }
    return result.data;
}
