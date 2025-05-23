import dayjs from "dayjs";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Space from "../../../../components/space";
import { setFinalDate } from "../helper";
import useHideDropdown from "../hooks/useHideDropdown";
import { useDateStore } from "../store";

export default function Hour() {
  const dateStore = useDateStore();
  const { date, setDate, invalid, validDate } = dateStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hourLabel, setHourLabel] = useState(dayjs(date).format("hh"));
  const dropdownRef = useRef(null);

  useHideDropdown({ dropdownRef, setIsOpen });

  // Generate hours from 1 to 12 (for 12-hour format)
  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectHour = (hour) => {
    setIsOpen(false);
    let hourNum = parseInt(hour, 10);
    const isPM = dayjs(date).hour() >= 12;

    if (hourNum === 12) {
      hourNum = isPM ? 12 : 0;
    } else if (isPM) {
      hourNum += 12;
    }

    const newDate = setFinalDate("hour", hourNum, date, validDate);
    setDate(newDate);
  };

  useEffect(() => {
    if (invalid) return;
    setHourLabel(dayjs(date).format("hh"));
  }, [date]);

  const handleClick = (type) => {
    let currentHour = dayjs(date).hour();
    let newHour;

    if (type === "add") {
      newHour = (currentHour + 1) % 24;
    } else if (type === "subtract") {
      newHour = (currentHour - 1 + 24) % 24;
    }

    const newDate = setFinalDate("hour", newHour, date, validDate);
    setDate(newDate);
  };

  return (
    <div className="calendar-hour" ref={dropdownRef}>
      <div className="calendar-hour-header" onClick={toggleDropdown}>
        <label className="calendar-hour-label">{hourLabel}</label>
        <div className="calendar-dropdown-icon">
          <Space direction="column" gap={0}>
            <ChevronUp
              size={15}
              color="#fff"
              style={{ marginBottom: "-5px" }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick("add");
              }}
            />
            <ChevronDown
              size={15}
              color="#fff"
              onClick={(e) => {
                e.stopPropagation();
                handleClick("subtract");
              }}
            />
          </Space>
        </div>
      </div>

      {isOpen && (
        <div className="calendar-hour-dropdown">
          {hours.map((hour) => (
            <label
              key={hour}
              className="calendar-hour-item"
              onClick={() => selectHour(hour)}
            >
              {hour}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
