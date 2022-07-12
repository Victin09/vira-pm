export const generateDateHours = () => {
  let hours = [];
  for (var hour = 0; hour < 24; hour++) {
    hours.push([hour, 0]);
    hours.push([hour, 15]);
    hours.push([hour, 30]);
    hours.push([hour, 45]);
  }

  const date = new Date();
  const formatter = new Intl.DateTimeFormat('es-ES', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });

  const range = hours.map(time => {
    const [hour, minute] = time;
    date.setHours(hour);
    date.setMinutes(minute);

    return formatter.format(date);
  });

  return range;
}

export const addHoursAndMinutesToDate = (hoursAndMinutes: string, date: Date) => {
  const split = hoursAndMinutes.split(':')
  const hours = Number(split[0])
  const minutes = Number(split[1])
  date.setHours(hours)
  date.setMinutes(minutes)

  return date
}

export const formatToDate = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDay()
  return `${day} - ${month} - ${year}`
}