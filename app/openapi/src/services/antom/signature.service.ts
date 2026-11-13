import { getAntomConfig } from "@lib/internal/config/payment";
import crypto, { createPublicKey } from "crypto";

export async function verifySignature(host: string, content: string, signature: string): Promise<boolean> {
    const antomConfig = await getAntomConfig(host);

    const publicKey = createPublicKey({
        key: Buffer.from(antomConfig.antomPublicKey, 'base64'),
        format: 'der',
        type: 'spki',
    });
    return crypto.verify('RSA-SHA256', Buffer.from(content, 'utf-8'), publicKey, Buffer.from(decodeURIComponent(signature), 'base64'));
}
