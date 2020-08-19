export const longDayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const longDayNamesStartingMonday = (
  longDayNames.slice(1).concat([longDayNames[0]])
);

export const shortDayNames = longDayNames.map((day) => day.substring(0, 3));

export const longMonthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const shortMonthNames = longMonthNames.map((month) => month.substring(0, 3));
