import { useEffect, useState } from "react";
import { useAdReportDailySummaryState } from "@app/manage-web/hooks/report/use-ad-report-daily-summary-state";
import { Spinner } from "@heroui/react";
import { type DateValue, today } from "@internationalized/date";
import SingleDatePicker from "@app/manage-web/components/date-picker";
import SummaryCard from "./summary-card";

export default function Dashboard() {
  const { adReportDailySummaryState, fetchAdReportDailySummary } = useAdReportDailySummaryState();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(() => today('Asia/Shanghai'));

  const formatDate = (date: DateValue) =>
    `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;

  const fetchSummary = (date: string) => {
    setLoading(true);
    fetchAdReportDailySummary({ date }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSummary(formatDate(selectedDate!));
  }, []);

  const handleDateChange = (date: DateValue | null) => {
    setSelectedDate(date);
    if (date) {
      fetchSummary(formatDate(date));
    }
  };

  return (
    <div>
      <div className="text-lg font-semibold text-gray-700 mb-5">欢迎使用后台管理系统</div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-base text-gray-600">广告数据汇总</span>
        <SingleDatePicker
          className="w-72"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : adReportDailySummaryState && adReportDailySummaryState.spend ? (
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard label="总花费" value={`$${Number(adReportDailySummaryState.spend).toLocaleString()}`} />
          <SummaryCard label="总购物转化价值" value={`$${Number(adReportDailySummaryState.purchasesConversionValue).toLocaleString()}`} />
          <SummaryCard label="ROAS" value={adReportDailySummaryState.purchaseRoas} />
        </div>
      ) : (
        <div className="text-sm text-gray-400">暂无数据</div>
      )}
    </div>
  );
}
