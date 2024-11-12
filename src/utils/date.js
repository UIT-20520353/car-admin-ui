export const formatDateNoTime = (value) => {
  if (!value) return "--";

  const date = new Date(value);
  let format = "DD/MM/YYYY ";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  format = format.replace("YYYY", year);
  format = format.replace("MM", month);
  format = format.replace("DD", day);

  return format;
};

export const hoursBetween = (date1, date2) => {
  const diffInMs = Math.abs(date2 - date1);

  const diffInHours = diffInMs / (1000 * 60 * 60);

  return diffInHours;
};
