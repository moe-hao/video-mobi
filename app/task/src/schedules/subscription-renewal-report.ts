import { statRenewalReport } from "../services/subscription/renewal-report.service";

export async function scheduleSubscriptionRenewalReport() {
    try {
        await statRenewalReport('2026-06-27');
        await statRenewalReport('2026-06-28');
        await statRenewalReport('2026-06-29');
        await statRenewalReport('2026-06-30');
        await statRenewalReport('2026-06-31');
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
    } catch (error) {
        console.error('统计订阅续费报告失败:', error);
    }
}
