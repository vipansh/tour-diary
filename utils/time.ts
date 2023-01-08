export function convert24To12(time?: string) {
  if (!time) return "";
  const hours = parseInt(time.substr(0, 2));
  const minutes = parseInt(time.substr(3, 2));
  const ampm = hours >= 12 ? "PM" : "AM";
  const newHours = hours % 12;
  const newHoursStr = newHours < 10 ? `0${newHours}` : newHours;
  const timeStr = `${newHoursStr}:${minutes} ${ampm}`;
  return timeStr;
}
