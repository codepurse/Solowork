import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { setFinalDate } from "../helper";
import useHideDropdown from "../hooks/useHideDropdown";
import dateStore from "../store";

export default function Month() {
  const { date, setDate, invalid, validDate } = dateStore();
  const [monthLabel, setMonthLabel] = useState(dayjs(date).format("MMMM"));
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useHideDropdown({ dropdownRef, setIsOpen });

  const months = Array.from({ length: 12 }, (_, i) => {
    return dayjs().month(i).format("MMMM");
  });

  const handleMonthSelect = (monthName) => {
    const newDate = setFinalDate("month", monthName, date, validDate);
    setDate(newDate);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (invalid) return;
    setMonthLabel(dayjs(date).format("MMMM"));
  }, [date]);

  return (
    <div className="calendar-month" ref={dropdownRef}>
      <div className="calendar-month-header" onClick={toggleDropdown}>
        <label className="calendar-month-label">{monthLabel}</label>
        <ChevronDown size={16} color="#fff" />
      </div>
      {isOpen && (
        <div className="calendar-month-dropdown">
          <div className="calendar-month-dropdown-item">
            {months.map((month, index) => (
              <label
                key={index}
                className="calendar-month-item"
                onClick={() => handleMonthSelect(index)}
              >
                {month}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
