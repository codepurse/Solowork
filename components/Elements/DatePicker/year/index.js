import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { setFinalDate } from "../helper";
import useHideDropdown from "../hooks/useHideDropdown";
import { useDateStore } from "../store";

export default function Year() {
  const dateStore = useDateStore();
  const { date, setDate, invalid, validDate } = dateStore();
  const [yearLabel, setYearLabel] = useState(dayjs(date).format("YYYY"));
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useHideDropdown({ dropdownRef, setIsOpen });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleChangeYear = (year) => {
    const newDate = setFinalDate("year", year, date, validDate);
    setDate(newDate);
    setIsOpen(false);
  };

  useEffect(() => {
    if (invalid) return;
    setYearLabel(dayjs(date).format("YYYY"));
  }, [date]);

  return (
    <div className="calendar-year" ref={dropdownRef}>
      <div className="calendar-year-header" onClick={toggleDropdown}>
        <label className="calendar-year-label">{yearLabel}</label>
        <ChevronDown size={16} color="#fff" />
      </div>
      {isOpen && (
        <div className="calendar-year-dropdown">
          <div className="calendar-year-dropdown-item">
            {Array.from({ length: dayjs().year() - 1990 + 1 }, (_, i) => {
              return (
                <label
                  className="calendar-year-item"
                  key={i}
                  onClick={() =>
                    handleChangeYear(
                      dayjs()
                        .year(1990 + i)
                        .format("YYYY")
                    )
                  }
                >
                  {dayjs()
                    .year(1990 + i)
                    .format("YYYY")}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
