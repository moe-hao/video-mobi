import { statRenewalReport } from "../services/subscription/renewal-report.service";

export async function scheduleSubscriptionRenewalReport() {
    try {
        await statRenewalReport('2026-06-26');
    } catch (error) {
        console.error('统计订阅续费报告失败:', error);
    }
}
