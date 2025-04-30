export default function Weeks() {
    const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="weeks-grid">
        {weeks.map((week, index) => (
          <div key={index} className="calendar-week">
            {week}
          </div>
        ))}
      </div>
    );
  }
  