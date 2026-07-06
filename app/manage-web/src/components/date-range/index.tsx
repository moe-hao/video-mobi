import { CalendarDate, type DateValue } from "@internationalized/date";
import { DateField, DateRangePicker, I18nProvider, RangeCalendar } from "@heroui/react";
import { useCallback, useMemo, useState } from "react";

/** 时间戳组成的日期范围值 */
export interface DateRangeValue {
  start: number;
  end: number;
}

interface DateRangeProps {
  className?: string;
  startName?: string;
  endName?: string;
  /** 默认值，传入 Unix 时间戳 */
  defaultValue?: DateRangeValue | null;
  /** 回调，返回 Unix 时间戳 */
  onChange?: (value: DateRangeValue | null) => void;
  /** 最大可选日期范围（天数），不传则不限制 */
  maxRangeDays?: number;
}

/** 时间戳 -> CalendarDate */
function timestampToCalendarDate(ts: number): CalendarDate {
  const d = new Date(ts * 1000);
  return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/** CalendarDate -> 时间戳 */
function calendarDateToTimestamp(date: DateValue, endOfDay = false): number {
  const d = new Date(date.year, date.month - 1, date.day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0);
  return Math.floor(d.getTime() / 1000);
}

export default function DateRange({
  className = "w-72",
  startName = "开始日期",
  endName = "结束日期",
  defaultValue = null,
  onChange,
  maxRangeDays,
}: DateRangeProps) {
  const initialValue = useMemo(() => {
    if (!defaultValue) return null;
    return {
      start: timestampToCalendarDate(defaultValue.start),
      end: timestampToCalendarDate(defaultValue.end),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback(
    (val: typeof initialValue) => {
      setValue(val);
      if (!val) {
        onChange?.(null);
        return;
      }
      onChange?.({
        start: calendarDateToTimestamp(val.start),
        end: calendarDateToTimestamp(val.end, true),
      });
    },
    [onChange],
  );

  const isDateUnavailable = useCallback(
    (date: DateValue) => {
      if (!maxRangeDays || !value?.start || value.end) return false;
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

/** 将日期转为 Unix 时间戳（本地时区） */
export function dateToUnixTimestamp(date: DateValue, endOfDay = false): number {
  return calendarDateToTimestamp(date, endOfDay);
}
