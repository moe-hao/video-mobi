import { statRenewalReport } from "../services/subscription/renewal-report.service";

export async function scheduleSubscriptionRenewalReport() {
    try {
        await statRenewalReport('2026-06-26');
        await statRenewalReport('2026-06-27');
        await statRenewalReport('2026-06-28');
        await statRenewalReport('2026-06-29');
        await statRenewalReport('2026-06-30');
        await statRenewalReport('2026-07-01');
        await statRenewalReport('2026-07-02');
        await statRenewalReport('2026-07-03');
        await statRenewalReport('2026-07-04');
        await statRenewalReport('2026-07-05');
        await statRenewalReport('2026-07-06');
        await statRenewalReport('2026-07-07');
        await statRenewalReport('2026-07-08');
        await statRenewalReport('2026-07-09');
        await statRenewalReport('2026-07-10');
        await statRenewalReport('2026-07-11');
        await statRenewalReport('2026-07-12');
        await statRenewalReport('2026-07-13');
        await statRenewalReport('2026-07-14');
        await statRenewalReport('2026-07-15');
        await statRenewalReport('2026-07-16');
        await statRenewalReport('2026-07-17');
        await statRenewalReport('2026-07-18');
        await statRenewalReport('2026-07-19');
        await statRenewalReport('2026-07-20');
        await statRenewalReport('2026-07-21');
        await statRenewalReport('2026-07-22');
        await statRenewalReport('2026-07-23');
        await statRenewalReport('2026-07-24');
        await statRenewalReport('2026-07-25');
        await statRenewalReport('2026-07-26');
        await statRenewalReport('2026-07-27');
        await statRenewalReport('2026-07-28');
        await statRenewalReport('2026-07-29');
        await statRenewalReport('2026-07-30');
        await statRenewalReport('2026-07-31');
        await statRenewalReport('2026-08-01');
        await statRenewalReport('2026-08-02');
        await statRenewalReport('2026-08-03');
        await statRenewalReport('2026-08-04');
        await statRenewalReport('2026-08-05');
        await statRenewalReport('2026-08-06');
        await statRenewalReport('2026-08-07');
        await statRenewalReport('2026-08-08');
        await statRenewalReport('2026-08-09');
        await statRenewalReport('2026-08-10');
        await statRenewalReport('2026-08-11');
        await statRenewalReport('2026-08-12');
        await statRenewalReport('2026-08-13');
    } catch (error) {
        console.error('统计订阅续费报告失败:', error);
    }
}
