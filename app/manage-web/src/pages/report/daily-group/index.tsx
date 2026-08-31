import { Button, Spinner, Table } from "@heroui/react";
import { useEffect, useState } from "react";
import { useAdReportDailyGroupState } from "@app/manage-web/hooks/report/use-ad-report-daily-group-state";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import type { AdReportDailyGroupReq } from "@lib/common/dto/ad-report-daily";
import { useSearchParams } from "react-router";
import { CalendarDate, type DateValue } from "@internationalized/date";
import SingleDatePicker from "@app/manage-web/components/date-picker";
import RegionSelect from "@app/manage-web/components/region-select";
import PlatformSelect from "@app/manage-web/components/platform-select";
import { Region } from "@lib/common/consts/region";

export default function DailyGroup() {
  const { adReportDailyGroupState, fetchAdReportDailyGroup } = useAdReportDailyGroupState();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialStartStr = searchParams.get('start') || '';
  const initialEndStr = searchParams.get('end') || '';

  const toDateValue = (str: string): DateValue | null => {
    if (!str) return null;
    return new CalendarDate(Number(str.slice(0, 4)), Number(str.slice(5, 7)), Number(str.slice(8, 10)));
  };

  const formatDate = (date: DateValue | null): string => {
    if (!date) return '';
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  };

  const initialParams: AdReportDailyGroupReq = {
    start: initialStartStr,
    end: initialEndStr,
    country: searchParams.get('country') || '',
    platform: Number(searchParams.get('platform')) || 1,
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 20,
  };

  const [loading, setLoading] = useState(false);
  const [req, setReq] = useState<AdReportDailyGroupReq>(initialParams);
  const [startDate, setStartDate] = useState<DateValue | null>(toDateValue(initialStartStr));
  const [endDate, setEndDate] = useState<DateValue | null>(toDateValue(initialEndStr));

  useEffect(() => {
    if (initialStartStr && initialEndStr) {
      setLoading(true);
      fetchAdReportDailyGroup(initialParams).finally(() => setLoading(false));
    }
  }, []);

  const handleSearch = async (params: AdReportDailyGroupReq) => {
    setSearchParams({
      start: params.start,
      end: params.end,
      country: params.country,
      platform: params.platform.toString(),
      page: params.page.toString(),
      size: params.size.toString(),
    });
    setLoading(true);
    try {
      await fetchAdReportDailyGroup(params);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">日报分组</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <SingleDatePicker
          className="w-60"
          value={startDate}
          onChange={(date) => {
            setStartDate(date);
            setReq({ ...req, start: formatDate(date) });
          }}
        />
        <span className="text-gray-400">-</span>
        <SingleDatePicker
          className="w-60"
          value={endDate}
          onChange={(date) => {
            setEndDate(date);
            setReq({ ...req, end: formatDate(date) });
          }}
        />
        <PlatformSelect
          className="w-64"
          value={req.platform.toString()}
          onChange={(platform) => setReq({ ...req, platform: Number(platform) || 1 })}
        />
        <RegionSelect
          className="w-64"
          value={req.country as Region | ''}
          onChange={(country) => setReq({ ...req, country })}
        />
        <Button variant="primary" size="sm" onClick={() => handleSearch(req)}>查询</Button>
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <Spinner size="lg" />
          </div>
        )}
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="日报分组数据" className="w-max min-w-full">
              <Table.Header>
                <Table.Column className="whitespace-nowrap" isRowHeader>日期</Table.Column>
                <Table.Column className="whitespace-nowrap">地区</Table.Column>
                <Table.Column className="whitespace-nowrap">花费</Table.Column>
                <Table.Column className="whitespace-nowrap">展示</Table.Column>
                <Table.Column className="whitespace-nowrap">点击量</Table.Column>
                <Table.Column className="whitespace-nowrap">购物转化价值</Table.Column>
                <Table.Column className="whitespace-nowrap">转化数</Table.Column>
              </Table.Header>
              <Table.Body>
                {(adReportDailyGroupState.list ?? []).map((item, index) => (
                  <Table.Row key={`${item.date}-${item.region}-${index}`}>
                    <Table.Cell className="whitespace-nowrap">{item.date}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.region}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">${item.spendSum.toFixed(2)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.impressionsSum}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.clicksNumSum}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">${item.purchasesConversionValueSum.toFixed(2)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{item.purchaseConversionCountSum}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
      <TablePagination
        page={adReportDailyGroupState.page || 1}
        size={adReportDailyGroupState.size || 20}
        total={adReportDailyGroupState.total || 0}
        sizeOptions={[20, 30, 50, 100]}
        onPageChange={(page) => handleSearch({ ...req, page })}
        onSizeChange={(size) => handleSearch({ ...req, size })}
      />
    </div>
  );
}
