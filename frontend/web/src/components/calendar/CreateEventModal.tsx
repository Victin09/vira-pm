import { EventAttributes } from "@tidify/common";
import { Formik, Form } from "formik";
import moment from "moment";
import React, { forwardRef, useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { createEvent } from "../../api/event";
import { Response } from "../../types";
import FormInput from "../auth/FormInput";
import DatePicker from "../../ui/DatePicker";
import { useSelectedGuild } from "../../store/useSelectedGuild";

import "moment/locale/es"

interface Props {
  currentDate: Date;
  handleClick: () => void
}

const CustomInput = forwardRef<HTMLInputElement>(({ value, onClick }: any, ref) => (
  <div className="form-control w-full max-w-xs">
    <label className="label">
      <span className="label-text">What is your name?</span>
    </label>
    <input className="input input-bordered w-full" onClick={onClick} ref={ref} value={value} />
  </div>
)
);

const CreateEventModal: React.FC<Props> = ({
  currentDate,
  handleClick
}) => {
  const [date, setDate] = useState<Date | null>(currentDate)
  const queryClient = useQueryClient();
  const selectedGuild = useSelectedGuild(state => state.selectedGuild);

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

  return (
    <>
      <input type="checkbox" id="createEventModal" className="modal-toggle" />
      <div className="modal modal-open">
        <div className="modal-box relative overflow-y-visible">
          <label htmlFor="createEventModal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={handleClick}>✕</label>
          <h3 className="text-lg font-bold">Crea un evento en el calendario</h3>
          <DatePicker
            dateFormat="dd/MM/yyyy HH:mm"
            timeFormat="HH:mm"
            showTimeSelect
            locale="es"
            selected={date}
            onChange={(date: Date | null) => setDate(date)}
            customInput={<CustomInput />}
          />
        </div>
      </div>
    </>
  );
};
type DatePickerFieldProps = {
  name: string;
  value: string;
  onChangeFunc: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
};
const DatePickerField: React.FC<DatePickerFieldProps> = ({
  name,
  value,
  onChangeFunc,
}) => {
  return (
    <DatePicker
      selected={(value && new Date(value)) || null}
      onChange={(val) => {
        onChangeFunc(name, val);
      }}
    />
  );
};

export default CreateEventModal;

