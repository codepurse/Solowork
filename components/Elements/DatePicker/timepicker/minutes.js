import dayjs from "dayjs";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Space from "../../../../components/space";
import { setFinalDate } from "../helper";
import useHideDropdown from "../hooks/useHideDropdown";
import dateStore from "../store";

export default function Minutes() {
  const { date, setDate, invalid, validDate } = dateStore();
  const [isOpen, setIsOpen] = useState(false);
  const minutes = Array.from({ length: 59 }, (_, i) => i + 1);
  const [minuteLabel, setMinuteLabel] = useState(dayjs(date).format("mm"));
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);

  useHideDropdown({ dropdownRef, setIsOpen });

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectMinute = (minute) => {
    setIsOpen(false);
    const newDate = setFinalDate("minute", minute, date, validDate);
    setDate(newDate);
  };

  useEffect(() => {
    if (invalid) return;
    setMinuteLabel(dayjs(date).format("mm"));
  }, [date]);

  const handleClick = (type) => {
    let currentMinute = dayjs(date).minute();
    let newMinute;
    if (type === "add") {
      newMinute = (currentMinute + 1) % 60;
    } else if (type === "subtract") {
      newMinute = (currentMinute - 1 + 60) % 60;
    }
    const newDate = setFinalDate("minute", newMinute, date, validDate);
    setDate(newDate);
  };

  return (
    <div className="calendar-minutes" ref={dropdownRef}>
      <div
        className="calendar-minutes-header"
        ref={headerRef}
        onClick={toggleDropdown}
      >
        <label className="calendar-minutes-label">{minuteLabel}</label>
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

      {isOpen && (
        <div className={`calendar-minutes-dropdown`}>
          <div className="calendar-minutes-dropdown-item">
            {minutes.map((minute) => (
              <label
                key={minute}
                className="calendar-minutes-item"
                onClick={() => selectMinute(minute)}
              >
                {minute}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
