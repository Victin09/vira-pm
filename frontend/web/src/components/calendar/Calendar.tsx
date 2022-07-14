import {
  Calendar,
  momentLocalizer,
  HeaderProps,
  ToolbarProps,
} from "react-big-calendar";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { getEvents } from "../../api/event";
import { useSelectedGuild } from "../../store/useSelectedGuild";
import CreateEventModal from "./CreateEventModal";
import "moment/locale/es";
import "./calendar.scss";
import { formatToDate } from "../../utils/dates";

const localizer = momentLocalizer(moment);

const MyCalendar: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const selectedGuild = useSelectedGuild((state) => state.selectedGuild);
  const { data, isLoading } = useQuery(
    "events",
    () => getEvents(selectedGuild?.id),
    { enabled: !!selectedGuild }
  );

  const HeaderCellContent: React.FC<HeaderProps> = ({ label }) => {
    return (
      <div>
        <div className="bg-base-200">
          <span className="font-bold">{label.toUpperCase()}</span>
        </div>
      </div>
    );
  };

  const ToolbarContent: React.FC<ToolbarProps> = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const goToCurrent = () => {
      toolbar.onNavigate("TODAY");
    };

    return (
      <div className="flex justify-between items-center">
        <div className="flex m-1">
          <button
            className="btn btn-sm btn-primary m-1"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
          <button className="btn btn-sm btn-primary m-1" onClick={goToBack}>
            &#8249;
          </button>
          <button className="btn btn-sm btn-primary m-1" onClick={goToCurrent}>
            Hoy
          </button>
          <button className="btn btn-sm btn-primary m-1" onClick={goToNext}>
            &#8250;
          </button>
        </div>
        <label className="font-bold">{toolbar.label.toUpperCase()}</label>

        <div className="flex">
          <button
            className="btn btn-sm btn-primary m-1"
            onClick={() => toolbar.onView("month")}
          >
            Mes
          </button>
          <button
            className="btn btn-sm btn-primary m-1"
            onClick={() => toolbar.onView("week")}
          >
            Semana
          </button>
          <button
            className="btn btn-sm btn-primary m-1"
            onClick={() => toolbar.onView("day")}
          >
            Día
          </button>
          <button
            className="btn btn-sm btn-primary m-1"
            onClick={() => toolbar.onView("agenda")}
          >
            Agenda
          </button>
        </div>
      </div>
    );
  };

  const ColoredDateCellWrapper = ({ children, value }: any) => {
    const isToday = formatToDate(new Date()) === formatToDate(value);
    const dayBg = `${isToday ? "bg-info" : "bg-base-100"}`;
    return (
      <>
        {React.cloneElement(React.Children.only(children), {
          className: `${children.props.className} ${dayBg}`,
        })}
      </>
    );
  };

  const eventPropGetter = useCallback(
    (_, start, end, isSelected) => ({
      ...{
        className: "bg-primary font-semibold rounded outline-none border-none",
      },
      ...(moment(start).isAfter(moment().subtract(1, "hours")) && {
        className: "bg-warning font-semibold rounded outline-none border-none",
      }),
      ...(moment(end).isBefore(moment()) && {
        className: "bg-success font-semibold rounded outline-none border-none",
      }),
      ...(isSelected && {
        className:
          "bg-secondary font-semibold rounded outline-none border-none",
      }),
    }),
    []
  );

  if (isLoading) return null;

  return (
    <>
      <div className="m-2 w-full">
        <Calendar
          localizer={localizer}
          events={data.data}
          views={["month", "week", "day", "agenda"]}
          messages={{
            next: "Siguiente",
            previous: "Atrás",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            date: "Fecha",
            time: "Tiempo",
            event: "Evento",
            allDay: "Todo el día",
            showMore: (total) => `+${total} más`,
          }}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%", width: "100%" }}
          eventPropGetter={eventPropGetter}
          components={{
            header: HeaderCellContent,
            toolbar: ToolbarContent,
            dateCellWrapper: ColoredDateCellWrapper,
          }}
        />
      </div>
      {showModal && (
        <CreateEventModal
          currentDate={new Date()}
          handleClick={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default MyCalendar;
