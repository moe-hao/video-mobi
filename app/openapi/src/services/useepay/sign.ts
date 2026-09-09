import config from "@lib/internal/config";
import crypto from "crypto";

export function verifyUseePaySign(sign: string, data: string): boolean {
    const key = crypto.createPublicKey({
        key: Buffer.from(config.UseePayWebhookKey, "base64"),
        format: "der",
        type: "spki"
    });

    const publicKey = {
        key: key,
        padding: crypto.constants.RSA_PKCS1_PADDING,
    }

    return crypto.verify("RSA-SHA256", Buffer.from(data, "utf-8"), publicKey, Buffer.from(sign, "base64"))
}
