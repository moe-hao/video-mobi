import { readFileSync } from "fs";
import crypto from "crypto";
import config from "@lib/internal/config";

export function generatePayermaxSign(body: string): string {
    const privateKey = readFileSync(config.PayermaxPrivateKey);
    return crypto.createSign('RSA-SHA256').update(body).end().sign(privateKey, 'base64');
}

export function verifyPayermaxSign(body: string, sign: string): boolean {
    const publicKey = readFileSync(config.PayermaxPublicKey);
    return crypto.verify('RSA-SHA256', Buffer.from(body, 'utf-8'), publicKey, Buffer.from(sign, 'base64'));
}
