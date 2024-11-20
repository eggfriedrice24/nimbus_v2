import { useState } from "react"

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 })

    return eachDayOfInterval({ start, end })
  }

  const getWeekdays = () => {
    const days = Array.from({ length: 7 }, (_, i) =>
      format(new Date(2023, 0, i + getDay(new Date(2023, 0, 1))), "EEEEEE")
    )
    return days
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const formattedMonth = format(currentDate, "MMMM yyyy")

  return {
    currentDate,
    calendarDays: getCalendarDays(),
    weekdays: getWeekdays(),
    nextMonth,
    getWeekdays,
    previousMonth,
    formattedMonth,
  }
}
