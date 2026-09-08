import { PeriodType } from "@lib/common/consts/subscription";

export function getUseePaySubscriptionInterval(periodType: PeriodType): string {
    switch (periodType) {
        case PeriodType.Day:
            return 'day';
        case PeriodType.Week:
            return 'week';
        case PeriodType.Month:
            return 'month';
        case PeriodType.Year:
            return 'year';
    }
}
