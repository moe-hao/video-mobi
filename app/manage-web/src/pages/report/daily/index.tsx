import { Button, Input, Link, ListBox, Popover, Spinner, Table, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { useAdReportDailyListState } from "@app/manage-web/hooks/report/use-ad-report-daily-list-state";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import type { AdReportDailyListReq } from "@lib/common/dto/ad-report-daily";
import { useSearchParams } from "react-router";
import { CalendarDate, type DateValue } from "@internationalized/date";
import SingleDatePicker from "@app/manage-web/components/date-picker";
import { ArrowDown, ArrowUp, Gear } from "@gravity-ui/icons";

const ALL_COLUMNS = [
  { key: 'date', label: '日期' },
  { key: 'adAccount', label: '广告账户' },
  { key: 'campaign', label: '广告系列' },
  { key: 'adset', label: '广告组' },
  { key: 'ad', label: '广告' },
  { key: 'region', label: '地区' },
  { key: 'spend', label: '花费' },
  { key: 'impressions', label: '展示' },
  { key: 'cpm', label: 'CPM' },
  { key: 'clicksNum', label: '链接点击量' },
  { key: 'cpc', label: 'CPC' },
  { key: 'ctr', label: 'CTR' },
  { key: 'purchasesConversionValue', label: '购物转化价值' },
  { key: 'purchaseRoas', label: 'Purchase ROAS' },
  { key: 'videoP25', label: '视频25%' },
  { key: 'videoP50', label: '视频50%' },
  { key: 'videoP100', label: '视频100%' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
] as const;

const DEFAULT_VISIBLE_COLUMNS = ALL_COLUMNS.map(c => c.key);

export default function AdReportDailyList() {
  const { adReportDailyListState, fetchAdReportDailyList } = useAdReportDailyListState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('report-daily-visible-columns');
    if (saved) {
      try { return new Set(JSON.parse(saved)); } catch { /* ignore */ }
    }
    return new Set(DEFAULT_VISIBLE_COLUMNS);
  });

  const initialDateStr = searchParams.get('date') || '';
  const initialDate = initialDateStr
    ? new CalendarDate(
        Number(initialDateStr.slice(0, 4)),
        Number(initialDateStr.slice(5, 7)),
        Number(initialDateStr.slice(8, 10))
      )
    : null;

  const initialParams: AdReportDailyListReq = {
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 20,
    date: initialDateStr,
    adAccountId: searchParams.get('adAccountId') || '',
    campaignId: searchParams.get('campaignId') || '',
    adId: searchParams.get('adId') || '',
    sortField: (searchParams.get('sortField') as 'spend') || '',
    sortDir: (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc',
  };

  const [loading, setLoading] = useState(false);
  const [adReportDailyReq, setAdReportDailyReq] = useState<AdReportDailyListReq>(initialParams);
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(initialDate);

  useEffect(() => {
    setLoading(true);
    fetchAdReportDailyList(initialParams).finally(() => setLoading(false));
  }, []);

  const handleDateChange = (date: DateValue | null) => {
    setSelectedDate(date);
    if (date) {
      const formatted = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
      setAdReportDailyReq({ ...adReportDailyReq, date: formatted });
    } else {
      setAdReportDailyReq({ ...adReportDailyReq, date: '' });
    }
  };

  const changeSearchParams = (req: AdReportDailyListReq) => {
    setSearchParams({
      page: req.page.toString(),
      size: req.size.toString(),
      date: req.date.toString(),
      adAccountId: req.adAccountId.toString(),
      campaignId: req.campaignId.toString(),
      adId: req.adId.toString(),
      sortField: req.sortField,
      sortDir: req.sortDir,
    });
  }

  const handleSearch = async (req: AdReportDailyListReq) => {
    changeSearchParams(req);
    setLoading(true);
    try {
      await fetchAdReportDailyList(req);
    } finally {
      setLoading(false);
    }
  }

  const isVisible = (key: string) => visibleColumns.has(key);

  const handleSort = (field: 'spend' | 'purchasesConversionValue') => {
    const isCurrentSort = adReportDailyReq.sortField === field;
    const nextDir = isCurrentSort && adReportDailyReq.sortDir === 'desc' ? 'asc' : 'desc';
    const req = { ...adReportDailyReq, sortField: field, sortDir: nextDir as 'asc' | 'desc' };
    setAdReportDailyReq(req);
    handleSearch(req);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">运营日报表</div>
      </div>
      <div className="flex gap-6 mb-4 text-sm">
        <div>总花费: <span className="font-semibold">${Number(adReportDailyListState?.sumSpend ?? 0).toFixed(2)}</span></div>
        <div>总购物转化价值: <span className="font-semibold">${Number(adReportDailyListState?.sumPurchasesConversionValue ?? 0).toFixed(2)}</span></div>
        <div>总ROAS: <span className="font-semibold">{(Number(adReportDailyListState?.sumPurchasesConversionValue ?? 0) / Number(adReportDailyListState?.sumSpend || 1)).toFixed(6)}</span></div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Input
            aria-label="广告账户ID"
            variant="secondary"
            placeholder="广告账户ID"
            className="w-48"
            value={adReportDailyReq.adAccountId}
            onChange={(e) => setAdReportDailyReq({ ...adReportDailyReq, adAccountId: e.target.value })}
          />
          <Input
            aria-label="广告系列ID"
            variant="secondary"
            placeholder="广告系列ID"
            className="w-48"
            value={adReportDailyReq.campaignId}
            onChange={(e) => setAdReportDailyReq({ ...adReportDailyReq, campaignId: e.target.value })}
          />
          <Input
            aria-label="广告ID"
            variant="secondary"
            placeholder="广告ID"
            className="w-48"
            value={adReportDailyReq.adId}
            onChange={(e) => setAdReportDailyReq({ ...adReportDailyReq, adId: e.target.value })}
          />
          <SingleDatePicker
            className="w-72"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <Button variant="primary" size="sm" onClick={() => handleSearch(adReportDailyReq)}>查询</Button>
        <div className="flex-1"></div>
        <Popover>
          <Popover.Trigger>
            <Button variant="secondary" size="sm">
              <Gear className="size-4" /> 选择显示列
            </Button>
          </Popover.Trigger>
          <Popover.Content placement="bottom end">
            <ListBox
              aria-label="选择显示列"
              selectionMode="multiple"
              selectedKeys={visibleColumns}
              onSelectionChange={(keys) => {
                if (keys === 'all') {
                  setVisibleColumns(new Set(DEFAULT_VISIBLE_COLUMNS));
                  localStorage.setItem('report-daily-visible-columns', JSON.stringify(DEFAULT_VISIBLE_COLUMNS));
                } else {
                  const next = keys as Set<string>;
                  if (next.size > 0) {
                    setVisibleColumns(next);
                    localStorage.setItem('report-daily-visible-columns', JSON.stringify([...next]));
                  }
                }
              }}
            >
              {ALL_COLUMNS.map((col) => (
                <ListBox.Item key={col.key} id={col.key} textValue={col.label}>
                  {col.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Popover.Content>
        </Popover>
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <Spinner size="lg" />
          </div>
        )}
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="广告日报数据" className="w-max min-w-full">
            <Table.Header>
              {isVisible('date') && <Table.Column className="whitespace-nowrap" isRowHeader>日期</Table.Column>}
              {isVisible('adAccount') && <Table.Column className="whitespace-nowrap">广告账户</Table.Column>}
              {isVisible('campaign') && <Table.Column className="whitespace-nowrap">广告系列</Table.Column>}
              {isVisible('adset') && <Table.Column className="whitespace-nowrap">广告组</Table.Column>}
              {isVisible('ad') && <Table.Column className="whitespace-nowrap">广告</Table.Column>}
              {isVisible('region') && <Table.Column className="whitespace-nowrap">地区</Table.Column>}
              {isVisible('spend') && (
                <Table.Column className="whitespace-nowrap">
                  <button className="flex items-center gap-1 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('spend')}>
                     花费
                     {adReportDailyReq.sortField === 'spend' && adReportDailyReq.sortDir === 'desc' && <ArrowDown className="size-3" />}
                   {adReportDailyReq.sortField === 'spend' && adReportDailyReq.sortDir === 'asc' && <ArrowUp className="size-3" />}
                   </button>
                </Table.Column>
              )}
              {isVisible('purchasesConversionValue') && (
                <Table.Column className="whitespace-nowrap">
                  <button className="flex items-center gap-1 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('purchasesConversionValue')}>
                     购物转化价值
                     {adReportDailyReq.sortField === 'purchasesConversionValue' && adReportDailyReq.sortDir === 'desc' && <ArrowDown className="size-3" />}
                   {adReportDailyReq.sortField === 'purchasesConversionValue' && adReportDailyReq.sortDir === 'asc' && <ArrowUp className="size-3" />}
                   </button>
                </Table.Column>
              )}
              {isVisible('purchaseRoas') && <Table.Column className="whitespace-nowrap">ROAS</Table.Column>}
              {isVisible('impressions') && <Table.Column className="whitespace-nowrap">展示</Table.Column>}
              {isVisible('cpm') && <Table.Column className="whitespace-nowrap">CPM</Table.Column>}
              {isVisible('clicksNum') && <Table.Column className="whitespace-nowrap">链接点击量</Table.Column>}
              {isVisible('cpc') && <Table.Column className="whitespace-nowrap">CPC</Table.Column>}
              {isVisible('ctr') && <Table.Column className="whitespace-nowrap">CTR</Table.Column>}
              {isVisible('videoP25') && <Table.Column className="whitespace-nowrap">视频25%</Table.Column>}
              {isVisible('videoP50') && <Table.Column className="whitespace-nowrap">视频50%</Table.Column>}
              {isVisible('videoP100') && <Table.Column className="whitespace-nowrap">视频100%</Table.Column>}
              {isVisible('createTime') && <Table.Column className="whitespace-nowrap">创建时间</Table.Column>}
              {isVisible('updateTime') && <Table.Column className="whitespace-nowrap">更新时间</Table.Column>}
            </Table.Header>
            <Table.Body>
              {(adReportDailyListState.list ?? []).map((item) => (
                <Table.Row key={item.id}>
                  {isVisible('date') && <Table.Cell className="whitespace-nowrap">{item.date}</Table.Cell>}
                  {isVisible('adAccount') && (
                  <Table.Cell className="whitespace-nowrap">
                    <Tooltip delay={0}>
                      <Link>{item.adAccountName}</Link>
                      <Tooltip.Content placement="right">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground truncate">{item.adAccountId}</span>
                        </div>
                      </Tooltip.Content>
                    </Tooltip>
                  </Table.Cell>
                  )}
                  {isVisible('campaign') && (
                  <Table.Cell className="whitespace-nowrap">
                    <Tooltip delay={0}>
                      <Link>{item.campaignName}</Link>
                      <Tooltip.Content placement="right">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground truncate">{item.campaignId}</span>
                        </div>
                      </Tooltip.Content>
                    </Tooltip>
                  </Table.Cell>
                  )}
                  {isVisible('adset') && (
                  <Table.Cell className="whitespace-nowrap">
                    <Tooltip delay={0}>
                      <Link>{item.adsetName}</Link>
                      <Tooltip.Content placement="right">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground truncate">{item.adsetId}</span>
                        </div>
                      </Tooltip.Content>
                    </Tooltip>
                  </Table.Cell>
                  )}
                  {isVisible('ad') && (
                  <Table.Cell className="whitespace-nowrap">
                    <Tooltip delay={0}>
                      <Link>{item.adName}</Link>
                      <Tooltip.Content placement="right">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium flex-shrink-0">ID:</span>
                          <span className="text-muted-foreground truncate">{item.adId}</span>
                        </div>
                      </Tooltip.Content>
                    </Tooltip>
                  </Table.Cell>
                  )}
                  {isVisible('region') && <Table.Cell className="whitespace-nowrap">{item.region}</Table.Cell>}
                  {isVisible('spend') && <Table.Cell className="whitespace-nowrap">${item.spend}</Table.Cell>}
                  {isVisible('purchasesConversionValue') && <Table.Cell className="whitespace-nowrap">${item.purchasesConversionValue}</Table.Cell>}
                  {isVisible('purchaseRoas') && <Table.Cell className="whitespace-nowrap">{item.purchaseRoas}</Table.Cell>}
                  {isVisible('impressions') && <Table.Cell className="whitespace-nowrap">{item.impressions}</Table.Cell>}
                  {isVisible('cpm') && <Table.Cell className="whitespace-nowrap">{item.cpm}</Table.Cell>}
                  {isVisible('clicksNum') && <Table.Cell className="whitespace-nowrap">{item.clicksNum}</Table.Cell>}
                  {isVisible('cpc') && <Table.Cell className="whitespace-nowrap">{item.cpc}</Table.Cell>}
                  {isVisible('ctr') && <Table.Cell className="whitespace-nowrap">{item.ctr}</Table.Cell>}
                  {isVisible('videoP25') && <Table.Cell className="whitespace-nowrap">{item.videoP25}</Table.Cell>}
                  {isVisible('videoP50') && <Table.Cell className="whitespace-nowrap">{item.videoP50}</Table.Cell>}
                  {isVisible('videoP100') && <Table.Cell className="whitespace-nowrap">{item.videoP100}</Table.Cell>}
                  {isVisible('createTime') && <Table.Cell className="whitespace-nowrap">{item.createTime}</Table.Cell>}
                  {isVisible('updateTime') && <Table.Cell className="whitespace-nowrap">{item.updateTime}</Table.Cell>}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      </div>
      <TablePagination
        page={adReportDailyListState.page || 1}
        size={adReportDailyListState.size || 10}
        total={adReportDailyListState.total || 0}
        sizeOptions={[20, 30, 50, 100]}
        onPageChange={(page) => handleSearch({ ...adReportDailyReq, page })}
        onSizeChange={(size) => handleSearch({ ...adReportDailyReq, size })}
      />
    </div>
  )
}
