import dayjs from "dayjs";

export function setFinalDate(type, value, date, validDate) {
  const parsedDate = dayjs(date);
  const isValid = parsedDate.isValid();
  
  // Create a mapping of types to their corresponding dayjs methods
  const typeMethodMap = {
    days: 'date',    // dayjs uses 'date' for day of month
    month: 'month',
    year: 'year',
    hour: 'hour',
    minute: 'minute'
  };
  
  // Get the appropriate method name for the type
  const method = typeMethodMap[type];
  
  if (!method) {
    console.warn(`Invalid date type: ${type}`);
    return validDate;
  }
  
  // For 'days' type, the value is an object with a 'day' property
  const actualValue = type === 'days' ? value.day : value;
  
  // Apply the method to either the parsed date or the valid date
  const newDate = isValid 
    ? parsedDate[method](actualValue).toDate()
    : dayjs(validDate)[method](actualValue).toDate();
    
  return newDate;
}

export function TestImport() {
  const newDate = dayjs("2025-03-19");
  return console.log(newDate);
}
