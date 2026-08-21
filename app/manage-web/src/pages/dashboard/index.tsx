import { useEffect, useState } from "react";
import { useAdReportDailySummaryState } from "@app/manage-web/hooks/report/use-ad-report-daily-summary-state";
import { Spinner } from "@heroui/react";
import { type DateValue, today } from "@internationalized/date";
import SingleDatePicker from "@app/manage-web/components/date-picker";
import SummaryCard from "./summary-card";
import type { AdReportDailySummaryResp } from "@lib/common/dto/ad-report-daily";

const emptySummary: AdReportDailySummaryResp = { spend: '', purchasesConversionValue: '', purchaseRoas: '', purchaseConversionCount: 0 };

export default function Dashboard() {
  const { fetchAdReportDailySummary } = useAdReportDailySummaryState();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(() => today('Asia/Shanghai'));
  const [facebookSummary, setFacebookSummary] = useState<AdReportDailySummaryResp>(emptySummary);
  const [tiktokSummary, setTiktokSummary] = useState<AdReportDailySummaryResp>(emptySummary);
  const [totalSummary, setTotalSummary] = useState<AdReportDailySummaryResp>(emptySummary);

  const formatDate = (date: DateValue) =>
    `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;

  const fetchAllSummaries = (date: string) => {
    setLoading(true);
    Promise.all([
      fetchAdReportDailySummary({ date, platform: '' }),
      fetchAdReportDailySummary({ date, platform: '1' }),
      fetchAdReportDailySummary({ date, platform: '2' }),
    ]).then(([total, facebook, tiktok]) => {
      setTotalSummary(total);
      setFacebookSummary(facebook);
      setTiktokSummary(tiktok);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllSummaries(formatDate(selectedDate!));
  }, []);

  const handleDateChange = (date: DateValue | null) => {
    setSelectedDate(date);
    if (date) {
      fetchAllSummaries(formatDate(date));
    }
  };

  const hasData = (summary: AdReportDailySummaryResp): boolean => !!summary.spend && Number(summary.spend) > 0;

  return (
    <div>
      <div className="text-lg font-semibold text-gray-700 mb-5">欢迎使用后台管理系统</div>
      <div className="flex items-center gap-3 mb-6">
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
      ) : (
        <div className="flex flex-col gap-6">
           <SummarySection title="Facebook" summary={facebookSummary} hasData={hasData(facebookSummary)} />
           <SummarySection title="TikTok" summary={tiktokSummary} hasData={hasData(tiktokSummary)} />
           <SummarySection title="汇总" summary={totalSummary} hasData={hasData(totalSummary)} />
         </div>
      )}
    </div>
  );
}

function SummarySection({ title, summary, hasData }: { title: string; summary: AdReportDailySummaryResp; hasData: boolean }) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-600 mb-2">{title}</div>
      {hasData ? (
        <div className="grid grid-cols-4 gap-4">
          <SummaryCard label="总花费" value={`$${Number(summary.spend).toLocaleString()}`} />
          <SummaryCard label="总购物转化价值" value={`$${Number(summary.purchasesConversionValue).toLocaleString()}`} />
          <SummaryCard label="ROAS" value={summary.purchaseRoas} />
          <SummaryCard label="平均购物转化成本" value={`$${summary.purchaseConversionCount ? (Number(summary.spend) / summary.purchaseConversionCount).toFixed(2) : '0.00'}`} />
        </div>
      ) : (
        <div className="text-sm text-gray-400">暂无数据</div>
      )}
    </div>
  );
}
