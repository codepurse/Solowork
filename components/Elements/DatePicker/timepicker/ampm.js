import dayjs from "dayjs";
import { useDateStore } from "../store";

export default function AmPm() {
  const dateStore = useDateStore();
  const { date, setDate, validDate } = dateStore();
  const parsedDate = dayjs(date);
  const isValid = parsedDate.isValid();
  const period = dayjs(isValid ? date : validDate).format("A");

  const handleToggle = (newPeriod) => {
    console.log(newPeriod, period);
    if (newPeriod !== period) {
      const hour = dayjs(isValid ? date : validDate).hour();
      console.log(hour);
      let newHour;

      if (newPeriod === "AM" && hour >= 12) {
        newHour = hour - 12;
      } else if (newPeriod === "PM" && hour < 12) {
        newHour = hour + 12;
      } else {
        newHour = hour;
      }

      setDate(
        dayjs(isValid ? date : validDate)
          .hour(newHour)
          .toDate()
      );
    }
  };

  return (
    <div className="ampm-container">
      <button
        type="button"
        className={`ampm-button ${period === "AM" ? "active" : ""}`}
        onClick={() => handleToggle("AM")}
        aria-pressed={period === "AM"}
      >
        AM
      </button>
      <button
        type="button"
        className={`ampm-button ${period === "PM" ? "active" : ""}`}
        onClick={() => handleToggle("PM")}
        aria-pressed={period === "PM"}
      >
        PM
      </button>
    </div>
  );
}
