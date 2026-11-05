import { readFileSync } from "fs";
import crypto from "crypto";
import { config } from "@lib/internal/base/config";
import { getPayermaxConfig } from "@lib/internal/config/payment";

export function generatePayermaxSign(body: string): string {
    const privateKey = readFileSync(config.PayermaxPrivateKey);
    return crypto.createSign('RSA-SHA256').update(body).end().sign(privateKey, 'base64');
}

export async function verifyPayermaxSign(host: string, body: string, sign: string): Promise<boolean> {
    const payermaxConfig = await getPayermaxConfig(host);
    const publicKey = crypto.createPublicKey({
        key: Buffer.from(payermaxConfig.platformPublicKey, "base64"),
        format: 'der',
        type: 'spki',
    });

    return crypto.verify('RSA-SHA256', Buffer.from(body, 'utf-8'), publicKey, Buffer.from(sign, 'base64'));
}
