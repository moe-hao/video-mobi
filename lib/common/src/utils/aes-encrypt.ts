import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { InternalException } from "../exceptions/internal-exception";
import config from "@lib/internal/config";
import { ResultCode } from "../consts/result";

export function encrypt(data: string, vector?: string): string {
    const key = createHash('sha256').update(config.EncryptSecret).digest().subarray(0, 16);
    const iv = vector ? Buffer.from(vector, 'hex') : randomBytes(16);
    const plaintext = Buffer.from(data, 'hex');
    const cipher = createCipheriv('aes-128-ctr', key, iv);

    const ciphertext = Buffer.concat([
        cipher.update(plaintext),
        cipher.final()
    ]);

    return iv.toString('hex') + ciphertext.toString('hex');
}

export function decrypt(data: string): string {
    try {
        const key = createHash('sha256').update(config.EncryptSecret).digest().subarray(0, 16);
        const iv = Buffer.from(data.slice(0, 32), 'hex');
        const ciphertext = Buffer.from(data.slice(32), 'hex');

        const decipher = createDecipheriv('aes-128-ctr', key, iv);
        const plaintext = Buffer.concat([
            decipher.update(ciphertext),
            decipher.final()
        ]);

        return plaintext.toString('hex');
    } catch (error) {
        throw new InternalException(ResultCode.DecryptError);
    }
}
