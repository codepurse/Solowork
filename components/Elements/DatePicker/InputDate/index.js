import dayjs from "dayjs";
import { useState } from "react";
import { useDateStore } from "../store";

export default function InputDate({ timeZone }) {
  const dateStore = useDateStore();
  const {
    date,
    setDate,
    setInvalid,
    isOpen,
    setIsOpen,
    setDoFormat,
    doFormat,
  } = dateStore();
  const [value, setValue] = useState(date);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const previousValue = date;

    if (previousValue.length > inputValue.length) {
      const prevDashes = (previousValue.match(/\-/g) || []).length;
      const newDashes = (inputValue.match(/\-/g) || []).length;
      const prevColons = (previousValue.match(/\:/g) || []).length;
      const newColons = (inputValue.match(/\:/g) || []).length;

      if (prevDashes > newDashes || prevColons > newColons) {
        return; // Don't update if a dash or colon was deleted
      }
    }
    const parsedDate = dayjs(inputValue);
    setDate(inputValue, true);
    setInvalid(!parsedDate.isValid());
    setValue(inputValue);
    setDoFormat(false);
  };

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <input
      type="text"
      className="date-input"
      id={!timeZone ? "date-input-timezone" : ""}
      value={doFormat ? date : value}
      onChange={handleChange}
      onClick={handleClick}
    />
  );
}
