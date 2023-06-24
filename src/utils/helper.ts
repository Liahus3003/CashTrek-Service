export const getMonthName = (monthNumber: number): string => {
  const date = new Date(0);
  date.setUTCMonth(monthNumber - 1); // Adjust month number to 0-based index
  return date.toLocaleString("default", { month: "long" })?.slice(0, 3);
};

