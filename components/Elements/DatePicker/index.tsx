import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Space from "../../../components/space";
import Days from "./days.js";
import HeaderControl from "./HeaderControl";
import useClickOutsideDate from "./hooks/useClickOutsideDate.js";
import usePositionDropdown from "./hooks/usePositionDropdown.js";
import InputDate from "./InputDate";
import Month from "./month";
import dateStore from "./store";
import AmPm from "./timepicker/ampm";
import Hour from "./timepicker/hour";
import Minutes from "./timepicker/minutes";
import Weeks from "./weeks";
import Year from "./year";
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function DateCmp({ withTime, value, onChange, timeZone }) {
  const { date, setDate, setWithTime, isOpen, doFormat } = dateStore();
  const dateCmpRef = useRef(null);
  const calendarRef = useRef(null);
  const [position, setPosition] = useState("bottom");
  const [firstRun, setFirstRun] = useState(true);

  useClickOutsideDate({ dateCmpRef });
  usePositionDropdown({ isOpen, calendarRef, dateCmpRef, setPosition });

  useEffect(() => {
    if (value) {
      setWithTime(withTime);
      if (firstRun) {
        const convertedDate = dayjs(value).tz(timeZone);
        setDate(convertedDate, false);
        setFirstRun(false);
      } else {
        setDate(value, !doFormat);
      }
    }
  }, [value]);

  useEffect(() => {
    if (onChange && dayjs(date).isValid()) {
      onChange(dayjs(date));
    }
  }, [date]);

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
          <Days date={date} setDate={setDate} />
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
