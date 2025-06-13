import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Space from "../../../components/space";

type Day = {
  month: number;
  year: number;
  day: number;
  type: string;
  isToday: boolean;
};

type CalendarListProps = {
  onDateSelect: (date: dayjs.Dayjs) => void;
  selectedDate: dayjs.Dayjs;
};

export default function CalendarList({
  onDateSelect,
  selectedDate,
}: Readonly<CalendarListProps>) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [days, setDays] = useState<Day[]>([]);

  // Get today's date for comparison
  const today = dayjs();

  useEffect(() => {
    const currentMonthStart = currentDate.startOf("month");
    const currentMonthEnd = currentDate.endOf("month");

    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= currentMonthEnd.date(); i++) {
      const day = currentMonthStart.date(i);
      currentMonthDays.push({
        month: day.month() + 1,
        year: day.year(),
        day: day.date(),
        type: "current",
        isToday: day.isSame(today, "day"),
      });
    }

    setDays(currentMonthDays);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  return (
    <div className="calendar-list">
      <div className="calendar-list-header">
        <Space gap={10} align="evenly">
          <p className="calendar-list-header-title">
            {currentDate.format("MMMM YYYY")}
          </p>
          <Space gap={5}>
            <i className="calendar-list-header-icon" onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </i>
            <i className="calendar-list-header-icon" onClick={handleNextMonth}>
              <ChevronRight size={16} />
            </i>
          </Space>
        </Space>
      </div>
      <div className="calendar-list-body">
        <div className="calendar-list-body-week">
          {weeks.map((week) => (
            <p key={week} className="calendar-list-body-week-day">
              {week}
            </p>
          ))}
        </div>
        <div className="calendar-list-body-days">
          {days.map((day, index) => (
            <div
              key={index}
              className={`calendar-list-body-day ${day.type} ${
                day.isToday ? "today" : ""
              } ${
                dayjs(`${day.year}-${day.month}-${day.day}`).isSame(
                  selectedDate,
                  "day"
                )
                  ? "selected-date"
                  : ""
              }`}
              onClick={() =>
                onDateSelect(dayjs(`${day.year}-${day.month}-${day.day}`))
              }
            >
              {day.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
