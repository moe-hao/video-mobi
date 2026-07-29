import config from "@lib/internal/config";
import crypto from "crypto";
import { readFileSync } from "fs";

export function verifySignature(content: string, signature: string) {
    const publicKey = readFileSync(config.AntomPublicKey);
    return crypto.verify('RSA-SHA256', Buffer.from(content, 'utf-8'), publicKey, Buffer.from(decodeURIComponent(signature), 'base64'));
}
