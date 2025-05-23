import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Space from "../../../components/space";
import DatePickerParent from "./DatePickerParent";
import Days from "./days.js";
import HeaderControl from "./HeaderControl";
import useClickOutsideDate from "./hooks/useClickOutsideDate.js";
import usePositionDropdown from "./hooks/usePositionDropdown.js";
import InputDate from "./InputDate";
import Month from "./month";
import { useDateStore } from "./store";
import AmPm from "./timepicker/ampm";
import Hour from "./timepicker/hour";
import Minutes from "./timepicker/minutes";
import Weeks from "./weeks";
import Year from "./year";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

function DatePickerComponent({ withTime, value, onChange, timeZone }) {
  const dateStore = useDateStore();
  const { date, setDate, setWithTime, isOpen, doFormat } = dateStore();
  const dateCmpRef = useRef(null);
  const calendarRef = useRef(null);
  const [position, setPosition] = useState("bottom");
  const [firstRun, setFirstRun] = useState(true);
  const [internalUpdate, setInternalUpdate] = useState(false);

  useClickOutsideDate({ dateCmpRef });
  usePositionDropdown({ isOpen, calendarRef, dateCmpRef, setPosition });

  useEffect(() => {
    console.log(date,"Date");
  }, [date]);

  // Handle external value changes
  useEffect(() => {
    if (!value || internalUpdate) return;

    const newDate = dayjs(value);
    if (!newDate.isValid()) return;

    const currentDateStr = dayjs(date).format("YYYY-MM-DD");
    const newDateStr = newDate.format("YYYY-MM-DD");

    if (currentDateStr !== newDateStr) {
      if (firstRun) {
        const convertedDate = dayjs(value).tz(timeZone);
        setInternalUpdate(true);
        setDate(convertedDate);
        setFirstRun(false);
        setInternalUpdate(false);
      } else {
        setInternalUpdate(true);
        setDate(value);
        setInternalUpdate(false);
      }
    }
  }, [value, timeZone]);

  // Handle internal date changes
  useEffect(() => {
    if (!onChange || !dayjs(date).isValid() || internalUpdate) return;

    const currentValue = value ? dayjs(value) : null;
    const newDate = dayjs(date);

    // Only trigger onChange if the dates are actually different
    if (!currentValue || !currentValue.isSame(newDate, 'day')) {
      onChange(newDate);
    }
  }, [date]);

  useEffect(() => {
    if (withTime) {
      setWithTime(true);
    }
  }, [withTime]);

  return (
    <div className="date-cmp" ref={dateCmpRef}>
      <i className="calendar-icon">
        <Calendar size={15} color="#fff" />
      </i>
      <InputDate timeZone={timeZone} />
      {isOpen && (
        <div className={`calendar-grid ${position}`} ref={calendarRef}>
          <div className="calendar-header">
            <Space gap={10}>
              <Month />
              <Year />
              <HeaderControl />
            </Space>
          </div>
          <Weeks />
          <Days date={date} setDate={(newDate) => {
            setInternalUpdate(true);
            setDate(newDate);
            setInternalUpdate(false);
          }} />
          {withTime && (
            <div className="time-picker-container">
              <Space gap={10}>
                <Hour />
                <span>:</span>
                <Minutes />
                <AmPm />
              </Space>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Export a wrapped version that includes the Provider
export default function DateCmp(props) {
  return (
    <DatePickerParent>
      <DatePickerComponent {...props} />
    </DatePickerParent>
  );
}
