const monthsBG = [
  "Януари",
  "Февруари",
  "Март",
  "Април",
  "Май",
  "Юни",
  "Юли",
  "Август",
  "Септември",
  "Октомври",
  "Ноември",
  "Декември",
];
const monthsEN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const fd = (d, f, { lang = "bg" } = {}) => {
  let date = d;
  let format = f;
  if (!(d instanceof Date)) {
    date = new Date(d);
  }

  const year = date.getFullYear();
  format = format.replace("yyyy", year);
  format = format.replace("YYYY", year);
  format = format.replace("yy", (((year / 100) % 1) * 100).toFixed());
  format = format.replace("YY", (((year / 100) % 1) * 100).toFixed());

  const month = date.getMonth() + 1;
  let monthNameLong = "";
  switch (lang) {
    case "en":
      monthNameLong = monthsEN[month - 1];
      break;

    case "bg":
    default:
      monthNameLong = monthsBG[month - 1];
      break;
  }
  format = format.replace("mm", (month + 1000).toString().substring(2));
  format = format.replace("m", month);
  format = format.replace("MM", monthNameLong);
  format = format.replace("M", monthNameLong.substr(0, 3));

  const day = date.getDate();
  format = format.replace("dd", (day + 1000).toString().substring(2));
  format = format.replace("d", day);

  const hour = date.getHours();
  format = format.replace("hh", (hour + 1000).toString().substring(2));
  format = format.replace("h", hour);

  let h = hour > 12 ? hour - 12 : hour;
  format = format.replace("HHH", hour < 13 ? "AM" : "PM");
  format = format.replace("HH", (h + 1000).toString().substring(2));
  format = format.replace("H", h);

  const minute = date.getMinutes();
  format = format.replace("nn", (minute + 1000).toString().substring(2));
  format = format.replace("n", minute);

  const second = date.getSeconds();
  format = format.replace("ss", (second + 1000).toString().substring(2));
  format = format.replace("s", second);

  return format;
};
