import { Button, Spinner, Table, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
import { useAdReportDailyGroupState } from "@app/manage-web/hooks/report/use-ad-report-daily-group-state";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import type { AdReportDailyGroupReq } from "@lib/common/dto/ad-report-daily";
import DateRange, { type DateRangeValue } from "@app/manage-web/components/date-range";
import RegionSelect from "@app/manage-web/components/region-select";
import { Region, RegionName } from "@lib/common/consts/region";
import { PixelPlatform } from "@lib/common/consts/pixel";

function formatDateFromTimestamp(ts: number): string {
  const d = new Date(ts * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function DailyGroupPanel({ platform }: { platform: number }) {
  const { adReportDailyGroupState, fetchAdReportDailyGroup } = useAdReportDailyGroupState();
  const [loading, setLoading] = useState(false);
  const [req, setReq] = useState<AdReportDailyGroupReq>({ start: '', end: '', country: '', platform, page: 1, size: 20 });
  const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

  useEffect(() => {
    handleSearch(req);
  }, []);

  const handleSearch = async (params: AdReportDailyGroupReq) => {
    setLoading(true);
    try {
      await fetchAdReportDailyGroup(params);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <DateRange
          className="w-72"
          defaultValue={dateRange}
          onChange={(range) => {
            setDateRange(range);
            if (range) {
              setReq({ ...req, start: formatDateFromTimestamp(range.start), end: formatDateFromTimestamp(range.end) });
            } else {
              setReq({ ...req, start: '', end: '' });
            }
          }}
        />
        <RegionSelect
          className="w-72"
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
                <Table.Column className="whitespace-nowrap border-x border-gray-200" isRowHeader>日期</Table.Column>
                <Table.Column className="whitespace-nowrap border-x border-gray-200">地区</Table.Column>
                <Table.Column className="whitespace-nowrap border-x border-gray-200">花费</Table.Column>
                <Table.Column className="whitespace-nowrap border-x border-gray-200">购物次数</Table.Column>
                <Table.Column className="whitespace-nowrap border-x border-gray-200">单次购物费用</Table.Column>
                <Table.Column className="whitespace-nowrap border-x border-gray-200">购物转化价值</Table.Column>
                <Table.Column className="whitespace-nowrap border-x border-gray-200">ROAS</Table.Column>
                <Table.Column className="whitespace-nowrap border-x border-gray-200">展示次数</Table.Column>
                <Table.Column className="whitespace-nowrap border-x border-gray-200">CPM</Table.Column>
                <Table.Column className="whitespace-nowrap border-x border-gray-200">点击量</Table.Column>
                <Table.Column className="whitespace-nowrap border-x border-gray-200">单次点击费用</Table.Column>
                <Table.Column className="whitespace-nowrap border-x border-gray-200">链接点击率</Table.Column>
              </Table.Header>
              <Table.Body>
                {(adReportDailyGroupState.list ?? []).map((item, index) => (
                  <Table.Row key={`${item.date}-${item.region}-${index}`}>
                    <Table.Cell className="whitespace-nowrap border-x border-gray-200">{item.date}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-x border-gray-200">{RegionName[item.region as Region] || item.region}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-x border-gray-200">${item.spendSum.toFixed(2)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-x border-gray-200">{item.purchaseConversionCountSum}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-x border-gray-200">${(item.spendSum / item.purchaseConversionCountSum).toFixed(2)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-x border-gray-200">${item.purchasesConversionValueSum.toFixed(2)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-x border-gray-200">${(item.purchasesConversionValueSum / item.spendSum * 100).toFixed(2)}%</Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-x border-gray-200">{item.impressionsSum}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-x border-gray-200">${(item.spendSum / item.impressionsSum * 1000).toFixed(2)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-x border-gray-200">{item.clicksNumSum}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-x border-gray-200">${(item.spendSum / item.clicksNumSum).toFixed(2)}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap border-x border-gray-200">{(item.clicksNumSum / item.impressionsSum * 100).toFixed(2)}%</Table.Cell>
                  </Table.Row>
                ))}
                {adReportDailyGroupState.summary && (() => {
                  const s = adReportDailyGroupState.summary;
                  return (
                    <Table.Row key="total" className="font-semibold bg-gray-50">
                      <Table.Cell className="whitespace-nowrap border-x border-gray-200">总计</Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-x border-gray-200">--</Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-x border-gray-200">${s.spendSum.toFixed(2)}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-x border-gray-200">{s.purchaseConversionCountSum}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-x border-gray-200">${s.purchaseConversionCountSum ? (s.spendSum / s.purchaseConversionCountSum).toFixed(2) : '0.00'}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-x border-gray-200">${s.purchasesConversionValueSum.toFixed(2)}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-x border-gray-200">${s.spendSum ? (s.purchasesConversionValueSum / s.spendSum * 100).toFixed(2) : '0.00'}%</Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-x border-gray-200">{s.impressionsSum}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-x border-gray-200">${s.impressionsSum ? (s.spendSum / s.impressionsSum * 1000).toFixed(2) : '0.00'}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-x border-gray-200">{s.clicksNumSum}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-x border-gray-200">${s.clicksNumSum ? (s.spendSum / s.clicksNumSum).toFixed(2) : '0.00'}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap border-x border-gray-200">{s.impressionsSum ? (s.clicksNumSum / s.impressionsSum * 100).toFixed(2) : '0.00'}%</Table.Cell>
                    </Table.Row>
                  );
                })()}
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

export default function DailyGroup() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">日报分组</div>
      </div>
      <Tabs defaultSelectedKey="facebook">
        <Tabs.ListContainer>
          <Tabs.List aria-label="平台">
            <Tabs.Tab id="facebook">Facebook<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="tiktok">TikTok<Tabs.Indicator /></Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel id="facebook">
          <DailyGroupPanel platform={PixelPlatform.Facebook} />
        </Tabs.Panel>
        <Tabs.Panel id="tiktok">
          <DailyGroupPanel platform={PixelPlatform.TikTok} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
