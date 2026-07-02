import { DateField, DateRangePicker, I18nProvider, RangeCalendar } from "@heroui/react";
import { useCallback, useState } from "react";

/** 与 @internationalized/date CalendarDate 兼容的日期值 */
interface CalendarDateLike {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  toDate(timeZone: string): Date;
}

/** 与 @react-types/shared RangeValue 兼容的日期范围 */
interface RangeValueLike<T> {
  start: T;
  end: T;
}

type DateRangeValue = RangeValueLike<CalendarDateLike> | null;

interface DateRangeProps {
  className?: string;
  startName?: string;
  endName?: string;
  defaultValue?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  /** 最大可选日期范围（天数），不传则不限制 */
  maxRangeDays?: number;
}

export default function DateRange({
  className = "w-72",
  startName = "开始日期",
  endName = "结束日期",
  defaultValue = null,
  onChange,
  maxRangeDays,
}: DateRangeProps) {
  const [value, setValue] = useState<DateRangeValue>(defaultValue);

  const handleChange = useCallback(
    (val: DateRangeValue) => {
      setValue(val);
      onChange?.(val);
    },
    [onChange],
  );

  const isDateUnavailable = useCallback(
    (date: CalendarDateLike) => {
      if (!maxRangeDays || !value?.start || value.end) return false;
      // 限制选择范围不超过 maxRangeDays 天
      const startMs = value.start.toDate("UTC").getTime();
      const dateMs = date.toDate("UTC").getTime();
      const diffDays = Math.abs(dateMs - startMs) / (1000 * 60 * 60 * 24);
      return diffDays > maxRangeDays;
    },
    [maxRangeDays, value?.start, value?.end],
  );

  return (
    <I18nProvider locale="zh-CN">
      <DateRangePicker
        aria-label="选择日期范围"
        className={className}
        value={value as any}
        onChange={handleChange as any}
        startName={startName}
        endName={endName}
        granularity="day"
        isDateUnavailable={maxRangeDays ? (isDateUnavailable as any) : undefined}
      >
        <DateField.Group variant="secondary" fullWidth>
          <DateField.Input slot="start">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <DateRangePicker.RangeSeparator />
          <DateField.Input slot="end">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <DateField.Suffix>
            {value && (
              <button
                type="button"
                aria-label="Clear selection"
                className="autocomplete__clear-button"
                data-slot="autocomplete-clear-button"
                tabIndex={-1}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleChange(null);
                }}
              >
                <svg
                  aria-hidden="true"
                  aria-label="Close icon"
                  fill="none"
                  height="16"
                  role="presentation"
                  viewBox="0 0 16 16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                  data-slot="autocomplete-clear-button-icon"
                >
                  <path
                    clipRule="evenodd"
                    d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <DateRangePicker.Trigger>
              <DateRangePicker.TriggerIndicator />
            </DateRangePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>

        <DateRangePicker.Popover>
          <RangeCalendar aria-label="选择日期范围">
            <RangeCalendar.Header>
              <RangeCalendar.YearPickerTrigger>
                <RangeCalendar.YearPickerTriggerHeading />
                <RangeCalendar.YearPickerTriggerIndicator />
              </RangeCalendar.YearPickerTrigger>
              <RangeCalendar.NavButton slot="previous" />
              <RangeCalendar.NavButton slot="next" />
            </RangeCalendar.Header>
            <RangeCalendar.Grid>
              <RangeCalendar.GridHeader>
                {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
              </RangeCalendar.GridHeader>
              <RangeCalendar.GridBody>
                {(date) => <RangeCalendar.Cell date={date} />}
              </RangeCalendar.GridBody>
            </RangeCalendar.Grid>
            <RangeCalendar.YearPickerGrid>
              <RangeCalendar.YearPickerGridBody>
                {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
              </RangeCalendar.YearPickerGridBody>
            </RangeCalendar.YearPickerGrid>
          </RangeCalendar>
        </DateRangePicker.Popover>
      </DateRangePicker>
    </I18nProvider>
  );
}

/** 将日期转为 Unix 时间戳（本地时区 0点0分0秒） */
export function dateToUnixTimestamp(date: CalendarDateLike, endOfDay = false): number {
  const year = date.year;
  const month = date.month - 1; // Date 月份从 0 开始
  const day = date.day;
  if (endOfDay) {
    // 23:59:59
    return Math.floor(new Date(year, month, day, 23, 59, 59).getTime() / 1000);
  }
  // 00:00:00
  return Math.floor(new Date(year, month, day, 0, 0, 0).getTime() / 1000);
}

/** 将日期范围转为 Unix 时间戳（开始 00:00:00，结束 23:59:59） */
export function dateRangeToUnixTimestamps(
  range: DateRangeValue,
): { startTimestamp: number; endTimestamp: number } | null {
  if (!range?.start || !range?.end) return null;
  return {
    startTimestamp: dateToUnixTimestamp(range.start),
    endTimestamp: dateToUnixTimestamp(range.end, true),
  };
}
