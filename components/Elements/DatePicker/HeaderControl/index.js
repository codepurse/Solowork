import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Space from "../../../space";
import dateStore from "../store";
export default function HeaderControl() {
  const { date, setDate } = dateStore();

  return (
    <div className="calendar-control">
      <Space gap={2} align="end" fill>
        <i onClick={() => setDate(dayjs(date).subtract(1, "month"))}>
          <ChevronLeft size={16} color="#fff" />
        </i>
        <i onClick={() => setDate(dayjs(date).add(1, "month"))}>
          <ChevronRight size={16} color="#fff" />
        </i>
      </Space>
    </div>
  );
}
