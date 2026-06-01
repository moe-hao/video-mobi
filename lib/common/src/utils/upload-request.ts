import type { Result } from "../dto/result";
import { InternalException } from "../exceptions/internal-exception";

export async function uploadRequest<ResponseType = undefined>(path: string, formData: FormData): Promise<ResponseType> {
    const resp = await fetch(path, {
        headers: {
            'Authorization': `${localStorage.getItem('token')}`,
        },
        method: 'POST',
        body: formData,
    });

    const result = await resp.json() as Result<ResponseType>;
    if (result.code !== 0) {
        throw new InternalException(result.code, result.message);
    }

    return result.data;
}
