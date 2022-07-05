import React, { forwardRef, useRef, useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { EventAttributes } from "@tidify/common";
import { createEvent } from "../../api/event";
import { Response } from "../../types";
import { useSelectedGuild } from "../../store/useSelectedGuild";

import { SubmitHandler, useForm } from "react-hook-form";
import useOnClickOutside from "../../hooks/useClickOutside";
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, { DayValue, DayRange, Day } from 'react-modern-calendar-datepicker'
import { addHoursAndMinutesToDate, generateDateHours } from "../../utils/dates";

interface Props {
  currentDate: Date;
  handleClick: () => void
}
const myCustomLocale = {
  // months list by order
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],

  // week days by order
  weekDays: [
    {
      name: 'Lunes',
      short: 'L',
    },
    {
      name: 'Martes',
      short: 'M',
    },
    {
      name: 'Miercoles',
      short: 'X',
    },
    {
      name: 'Jueves',
      short: 'J',
    },
    {
      name: 'Viernes',
      short: 'V',
    },
    {
      name: 'Sabado',
      short: 'S',
      isWeekend: true,
    },
    {
      name: 'Domingo', // used for accessibility 
      short: 'D', // displayed at the top of days' rows
      isWeekend: true, // is it a formal weekend or not?
    },
  ],

  // just play around with this number between 0 and 6
  weekStartingIndex: 1,

  // return a { year: number, month: number, day: number } object
  getToday(gregorainTodayObject: any) {
    return gregorainTodayObject;
  },

  // return a native JavaScript date here
  toNativeDate(date: any) {
    return new Date(date.year, date.month - 1, date.day);
  },

  // return a number for date's month length
  getMonthLength(date: any) {
    return new Date(date.year, date.month, 0).getDate();
  },

  // return a transformed digit to your locale
  transformDigit(digit: any) {
    return digit;
  },

  // texts in the date picker
  nextMonth: 'Siguiente mes',
  previousMonth: 'Mes anterior',
  openMonthSelector: 'Abre el selector de meses',
  openYearSelector: 'Abre el selector de años',
  closeMonthSelector: 'Cierra el selector de meses',
  closeYearSelector: 'Cierra el selector de años',
  defaultPlaceholder: 'Selcciona una fecha...',

  // for input range value
  from: 'from',
  to: 'to',


  // used for input value when multi dates are selected
  digitSeparator: ',',

  // if your provide -2 for example, year will be 2 digited
  yearLetterSkip: 0,

  // is your language rtl or ltr?
  isRtl: false,
}

const CreateEventModal: React.FC<Props> = ({
  currentDate,
  handleClick
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [day, setDay] = useState<DayValue>({ day: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() });
  const [startHours, setStartHours] = useState<string>('')
  const [endHours, setEndHours] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const queryClient = useQueryClient();
  const selectedGuild = useSelectedGuild(state => state.selectedGuild);
  const { register, handleSubmit, formState: { errors } } = useForm<{ title: string, startDate: Date, endDate: Date }>()

  useOnClickOutside(ref, handleClick)

  const mutation = useMutation(createEvent, {
    onMutate: (data: Omit<EventAttributes, "id">) => {
      queryClient.cancelQueries("events");

      const snapshot =
        queryClient.getQueryData<Response<EventAttributes[]>>("events");

      snapshot &&
        queryClient.setQueryData<Response<EventAttributes[]>>(
          "events",
          (prev) => ({
            data: [
              ...snapshot.data,
              {
                id: Math.random(),
                ...data,
              },
            ],
            message: prev!.message,
            success: prev!.success,
          })
        );

      return { snapshot };
    },
    onError: (_, __, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData<Response<EventAttributes[]>>(
          "events",
          context.snapshot
        );
      }
    },
    onSettled: () => queryClient.invalidateQueries("events"),
    onSuccess: handleClick
  });

  const onSubmit: SubmitHandler<{ title: string }> = (data) => {
    const startDate = addHoursAndMinutesToDate(startHours, new Date(day!.year, day!.month - 1, day!.day))
    const endDate = addHoursAndMinutesToDate(endHours, new Date(day!.year, day!.month - 1, day!.day))
    mutation.mutate({
      guildId: selectedGuild!.id,
      title: data.title,
      start: startDate,
      end: endDate
    })
    setLoading(true)
  }

  return (
    <>
      <input type="checkbox" id="createEventModal" className="modal-toggle" />
      <div className="modal modal-open">
        <div className="modal-box relative overflow-y-visible" ref={ref}>
          <label htmlFor="createEventModal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={handleClick}>✕</label>
          <h3 className="text-lg font-bold">Crea un evento en el calendario</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Título</span>
              </label>
              <input className={`${errors.title ? 'input-error ' : ''}input input-bordered w-full`} placeholder="Evento uno" {...register('title', { required: true })} />
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">El título es obligatorio</span>
                </label>
              )}
            </div>
            <div className="flex align-middle">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Qué día es el evento?</span>
                </label>
                <DatePicker
                  locale={myCustomLocale}
                  shouldHighlightWeekends
                  calendarClassName="bg-base-200"
                  calendarSelectedDayClassName="rounded bg-primary"
                  value={day}
                  onChange={setDay}
                  inputClassName="input text-left" />
              </div>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Hora de inicio</span>
                </label>
                <select className="select" onChange={(e) => setStartHours(e.target.value)}>
                  {generateDateHours().map((hour, index) => (
                    <option value={hour} key={index}>{hour}</option>
                  ))}
                </select>
              </div>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Hora final</span>
                </label>
                <select className="select" onChange={(e) => setEndHours(e.target.value)}>
                  {generateDateHours().map((hour, index) => (
                    <option value={hour} key={index}>{hour}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className={`btn btn-primary w-full mt-2${loading ? ' loading' : ''}`}>{loading ? 'Cargando' : 'Crear'}</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEventModal;

