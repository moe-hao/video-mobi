import { Button, Input, Link, Table, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { useAdReportDailyListState } from "@app/manage-web/hooks/report/use-ad-report-daily-list-state";
import TablePagination from "@app/manage-web/components/pagination/pagination";
import type { AdReportDailyListReq } from "@lib/common/dto/ad-report-daily";
import { useSearchParams } from "react-router";
import { CalendarDate, type DateValue } from "@internationalized/date";
import SingleDatePicker from "@app/manage-web/components/date-picker";

export default function AdReportDailyList() {
  const { adReportDailyListState, fetchAdReportDailyList } = useAdReportDailyListState();
  const [searchParams, setSearchParams] = useSearchParams();

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
  };

  const [adReportDailyReq, setAdReportDailyReq] = useState<AdReportDailyListReq>(initialParams);
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(initialDate);

  useEffect(() => {
    fetchAdReportDailyList(initialParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    });
  }

  const handleSearch = async (req: AdReportDailyListReq) => {
    changeSearchParams(req);
    await fetchAdReportDailyList(req);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold text-gray-700">运营日报表</div>
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
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="广告日报数据" className="w-max min-w-full">
            <Table.Header>
              <Table.Column className="whitespace-nowrap">ID</Table.Column>
              <Table.Column className="whitespace-nowrap" isRowHeader>日期</Table.Column>
              <Table.Column className="whitespace-nowrap">广告账户</Table.Column>
              <Table.Column className="whitespace-nowrap">广告系列</Table.Column>
              <Table.Column className="whitespace-nowrap">广告组</Table.Column>
              <Table.Column className="whitespace-nowrap">广告</Table.Column>
              <Table.Column className="whitespace-nowrap">地区</Table.Column>
              <Table.Column className="whitespace-nowrap">花费</Table.Column>
              <Table.Column className="whitespace-nowrap">展示</Table.Column>
              <Table.Column className="whitespace-nowrap">点击</Table.Column>
              <Table.Column className="whitespace-nowrap">CPM</Table.Column>
              <Table.Column className="whitespace-nowrap">点击数</Table.Column>
              <Table.Column className="whitespace-nowrap">CPC</Table.Column>
              <Table.Column className="whitespace-nowrap">CTR</Table.Column>
              <Table.Column className="whitespace-nowrap">视频25%</Table.Column>
              <Table.Column className="whitespace-nowrap">视频50%</Table.Column>
              <Table.Column className="whitespace-nowrap">视频100%</Table.Column>
              <Table.Column className="whitespace-nowrap">创建时间</Table.Column>
              <Table.Column className="whitespace-nowrap">更新时间</Table.Column>
            </Table.Header>
            <Table.Body>
              {adReportDailyListState.list?.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell className="whitespace-nowrap">{item.id}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.date}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    <Tooltip delay={0}>
                      <Link>{item.adAccountName}</Link>
                      <Tooltip.Content placement="right">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium flex-shrink-0">ID:</span>
                          <span className="text-muted-foreground truncate">{item.adAccountId}</span>
                        </div>
                      </Tooltip.Content>
                    </Tooltip>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    <Tooltip delay={0}>
                      <Link>{item.campaignName}</Link>
                      <Tooltip.Content placement="right">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium flex-shrink-0">ID:</span>
                          <span className="text-muted-foreground truncate">{item.campaignId}</span>
                        </div>
                      </Tooltip.Content>
                    </Tooltip>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    <Tooltip delay={0}>
                      <Link>{item.adsetName}</Link>
                      <Tooltip.Content placement="right">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium flex-shrink-0">ID:</span>
                          <span className="text-muted-foreground truncate">{item.adsetId}</span>
                        </div>
                      </Tooltip.Content>
                    </Tooltip>
                  </Table.Cell>
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
                  <Table.Cell className="whitespace-nowrap">{item.region}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.spend}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.impressions}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.clicks}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.cpm}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.clicksNum}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.cpc}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.ctr}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.videoP25}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.videoP50}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.videoP100}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.createTime}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{item.updateTime}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
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
