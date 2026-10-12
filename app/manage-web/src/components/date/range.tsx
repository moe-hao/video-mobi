import { CloseButton, DateField, DateRangePicker, RangeCalendar, type DateValue, type RangeValue } from "@heroui/react";
import { useState } from "react";

const DefaultTimeZone = "Asia/Shanghai";

export default function DateRange({ onChange }: { onChange: (startTime: string, endTime: string) => void }) {
  const [value, setValue] = useState<RangeValue<DateValue> | null>(null);

  function handleOnChange(value: RangeValue<DateValue> | null) {
    setValue(value);
    const { start, end } = value || {};

    const startTime = start ? start.toDate(DefaultTimeZone).getTime() / 1000 : "";
    const endTime = end ? (end.toDate(DefaultTimeZone).getTime() / 1000) + 24 * 60 * 60 - 1 : "";
    onChange(startTime.toString(), endTime.toString());
  }

  return (
    <DateRangePicker aria-label="date-range" onChange={handleOnChange} value={value}>
      <DateField.Group variant="secondary" className="w-72">
        <DateField.InputContainer>
          <DateField.Input slot="start">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <DateRangePicker.RangeSeparator />
          <DateField.Input slot="end">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
        </DateField.InputContainer>
        <DateField.Suffix>
          {value && (
            <CloseButton
              onMouseDown={(e) => {
                e.stopPropagation();
                handleOnChange(null);
              }}
            />
          )}
          <DateRangePicker.Trigger>
            <DateRangePicker.TriggerIndicator />
          </DateRangePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <DateRangePicker.Popover>
        <RangeCalendar aria-label="Choose trip dates">
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
            <RangeCalendar.GridBody>{(date) => <RangeCalendar.Cell date={date} />}</RangeCalendar.GridBody>
          </RangeCalendar.Grid>
        </RangeCalendar>
      </DateRangePicker.Popover>
    </DateRangePicker>
  )
}
