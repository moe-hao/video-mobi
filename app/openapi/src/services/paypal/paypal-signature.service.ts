import crypto from "crypto";
import { logger } from "@lib/internal/logger";
import { createMiddleware } from "hono/factory";

export const paypalSignatureService = {
    validate: async (
        transmissionId: string,
        transmissionTime: string,
        certUrl: string,
        webhookId: string,
        webhookSignature: string,
        webhookBody: string
    ): Promise<boolean> => {
        const eventTime = new Date(transmissionTime);
        const now = new Date();
        const diffSeconds = Math.abs((now.getTime() - eventTime.getTime()) / 1000);

        if (diffSeconds > 300) {
            logger.error("Webhook timestamp too old");
            return false;
        }

        const bodyHash = crypto.createHash("sha256").update(webhookBody).digest("hex");
        const verificationString = `${transmissionId}|${transmissionTime}|${webhookId}|${bodyHash}`;
        const cert = await paypalSignatureService.fetchCertificate(certUrl);

        const verifier = crypto.createVerify("RSA-SHA256");
        verifier.update(verificationString);
        return verifier.verify(cert, webhookSignature, "hex");

    },

    fetchCertificate: async (url: string): Promise<string> => {
        const res = await fetch(url);
        return res.text();
    }
}

export const paypalSignature = createMiddleware(async (c, next) => {
    const transmissionId = c.req.header("PAYPAL-TRANSMISSION-ID") as string;
    const transmissionTime = c.req.header("PAYPAL-TRANSMISSION-TIME") as string;
    const certURL = c.req.header("PAYPAL-CERT-URL") as string;
    const webhookSignature = c.req.header("PAYPAL-TRANSMISSION-SIG") as string;

    const body = await c.req.text();
    const data = JSON.parse(body);
    const webhookId = data.id;

    paypalSignatureService.validate(
        transmissionId,
        transmissionTime,
        certURL,
        webhookId,
        webhookSignature,
        body,
    )
});
