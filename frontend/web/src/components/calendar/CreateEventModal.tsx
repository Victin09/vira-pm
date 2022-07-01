import React, { forwardRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { useQueryClient, useMutation } from "react-query";
import es from "date-fns/locale/es"; // the locale you want
import { EventAttributes } from "@tidify/common";
import { createEvent } from "../../api/event";
import { Response } from "../../types";
import { useSelectedGuild } from "../../store/useSelectedGuild";

import 'react-datepicker/dist/react-datepicker.css'
import { SubmitHandler, useForm } from "react-hook-form";

registerLocale("es", es); // register it with the name you want

interface Props {
  currentDate: Date;
  handleClick: () => void
}

const CustomInputStart = forwardRef<HTMLInputElement>(({ value, onClick }: any, ref) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text">Fecha de comienzo</span>
    </label>
    <input className="input input-bordered w-full" onClick={onClick} ref={ref} value={value} />
  </div>
));

const CustomInputEnd = forwardRef<HTMLInputElement>(({ value, onClick }: any, ref) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text">Fecha final</span>
    </label>
    <input className="input input-bordered w-full" onClick={onClick} ref={ref} value={value} />
  </div>
));

const CreateEventModal: React.FC<Props> = ({
  currentDate,
  handleClick
}) => {
  const [startDate, setStartDate] = useState<Date | null>(currentDate)
  const [endDate, setEndDate] = useState<Date | null>()
  const queryClient = useQueryClient();
  const selectedGuild = useSelectedGuild(state => state.selectedGuild);
  const { register, handleSubmit, formState: { errors } } = useForm<{ title: string, startDate: Date, endDate: Date }>()

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
  });

  const onSubmit: SubmitHandler<{ title: string, startDate: Date, endDate: Date }> = (data) => {
    mutation.mutate({
      guildId: selectedGuild!.id,
      title: data.title,
      start: startDate!,
      end: endDate!
    })
  }


  return (
    <>
      <input type="checkbox" id="createEventModal" className="modal-toggle" />
      <div className="modal modal-open">
        <div className="modal-box relative overflow-y-visible">
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
            <DatePicker
              dateFormat="dd/MM/yyyy HH:mm"
              timeFormat="HH:mm"
              showTimeSelect
              locale="es"
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              customInput={<CustomInputStart />}
            />
            <DatePicker
              dateFormat="dd/MM/yyyy HH:mm"
              timeFormat="HH:mm"
              showTimeSelect
              locale="es"
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              customInput={<CustomInputEnd />}
            />
            <button type="submit" className="btn btn-primary w-full mt-2">Crear</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEventModal;

