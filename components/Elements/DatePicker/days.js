import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { setFinalDate } from "./helper";
import dateStore from "./store";
export default function Days({ date, setDate }) {
  const { invalid, validDate, setDoFormat } = dateStore();
  const currentMonthStart = dayjs(date).startOf("month");
  const currentMonthEnd = dayjs(date).endOf("month");
  const [days, setDays] = useState([]);

  const firstDayOfMonth = currentMonthStart.day();

  useEffect(() => {
    const prevMonth = currentMonthStart.subtract(1, "month");
    const prevMonthDays = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = prevMonth.endOf("month").subtract(i, "day");
      prevMonthDays.push({
        month: day.month() + 1,
        year: day.year(),
        day: day.date(),
        type: "prev", // Mark as previous month
      });
    }

    // Current Month Days
    const currentMonthDays = [];
    for (let i = 1; i <= currentMonthEnd.date(); i++) {
      const day = currentMonthStart.date(i);
      currentMonthDays.push({
        month: day.month() + 1,
        year: day.year(),
        day: day.date(),
        type: "current", // Mark as current month
      });
    }

    // Next Month Days
    const totalDays = prevMonthDays.length + currentMonthDays.length;

    // Calculate remaining days to always fill 6 complete rows (42 days total)
    const remainingDays = 42 - totalDays;

    const nextMonth = currentMonthStart.add(1, "month");
    const nextMonthDays = [];
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        month: nextMonth.month() + 1,
        year: nextMonth.year(),
        day: i,
        type: "next", // Mark as next month
      });
    }

    if (invalid) return;
    setDays([...prevMonthDays, ...currentMonthDays, ...nextMonthDays]);
  }, [date]);

  const handleDayClick = (day) => {
    const newDate = setFinalDate("days", day, date, validDate);
    setDoFormat(true);
    setDate(newDate);
  };

  return (
    <div className="days-grid">
      {days.map((day, index) => (
        <div
          key={index}
          className={`calendar-day ${day.type}`}
          onClick={() => handleDayClick(day)}
          id={
            dayjs(date).date() === day.day &&
            dayjs(date).month() + 1 === day.month &&
            dayjs(date).year() === day.year
              ? "active-day"
              : ""
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleDayClick(day);
            }
          }}
          aria-label={`${day.month}/${day.day}/${day.year}`}
        >
          {day.day}
        </div>
      ))}
    </div>
  );
}
