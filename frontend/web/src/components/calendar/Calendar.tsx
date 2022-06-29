import { Calendar, momentLocalizer, HeaderProps, ToolbarProps, EventProps, EventPropGetter, EventWrapperProps } from "react-big-calendar";
import moment from "moment";
import React, { useCallback, useRef, useState } from "react";
import BoxWrapper from "../shared/BoxWrapper";
import { useQuery } from "react-query";
import { getEvents } from "../../api/event";
import { useSelectedGuild } from "../../store/useSelectedGuild";
import { useDisclosure } from "@chakra-ui/hooks";
import CreateEventModal from "./CreateEventModal";
import 'moment/locale/es';
import './calendar.scss'
import useOnClickOutside from "../../hooks/useClickOutside";

const localizer = momentLocalizer(moment);

const HeaderCellContent: React.FC<HeaderProps> = ({ label }) => {
    return (
        <div>
            <div className="bg-base-200">
                <span className="font-bold">
                    {label.toUpperCase()}
                </span>
            </div>
        </div>
    );
};

const ToolbarContent: React.FC<ToolbarProps> = (toolbar) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    const label = () => {
        const date = moment(toolbar.date);
        return (
            <span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
        );
    };

    return (
        <div className="flex justify-between items-center">

            <div className="flex m-1">
                <button className="btn btn-sm btn-primary m-1" onClick={goToBack}>&#8249;</button>
                <button className="btn btn-sm btn-primary m-1" onClick={goToCurrent}>Hoy</button>
                <button className="btn btn-sm btn-primary m-1" onClick={goToNext}>&#8250;</button>
            </div>
            <label className="font-bold">{toolbar.label.toUpperCase()}</label>

            <div className="flex">
                <button className="btn btn-sm btn-primary m-1" onClick={() => toolbar.onView("month")}>Mes</button>
                <button className="btn btn-sm btn-primary m-1" onClick={() => toolbar.onView("week")}>Semana</button>
                <button className="btn btn-sm btn-primary m-1" onClick={() => toolbar.onView("day")}>Día</button>
                <button className="btn btn-sm btn-primary m-1" onClick={() => toolbar.onView("agenda")}>Agenda</button>
            </div>
        </div >
    );
};

// const EventWrapperContent: React.FC<EventWrapperProps> = ({ event, onClick, accessors, className, continuesEarlier, continuesLater, getters, isRtl, label, onDoubleClick, selected, children }) => {
//     console.log('event', event)
//     console.log('selected', selected)
//     // console.log('title', title)

//     const ref = useRef<HTMLDivElement>(null)
//     const [eventSelected, setEventSelected] = useState<boolean>(selected)

//     const handleClickOutside = () => {
//         setEventSelected(false)
//     }

//     useOnClickOutside(ref, handleClickOutside)

//     return (
//         <div ref={ref} className={` p-1 rounded text-primary-content w-full`} onClick={() => setEventSelected(!eventSelected)}>
//             {/* {eventSelected && (<span className="badge">Elected</span>)}
//             <span className="font-bold">{event.title}</span> */}
//             <div >
//                 {children}
//             </div>
//         </div >
//     )
// }

// const EventContent: React.FC<EventProps> = ({ event, title }) => {
//     console.log('title', title)
//     console.log('eventEvent', event)
//     return (
//         <div className="">
//             <div>{event.title}</div>
//         </div>
//     )
// }

const MyCalendar: React.FC = () => {
    const disclosure = useDisclosure();
    const { onOpen } = disclosure;
    const selectedGuild = useSelectedGuild((state) => state.selectedGuild);
    const { data, isLoading } = useQuery(
        "events",
        () => getEvents(selectedGuild?.id),
        { enabled: !!selectedGuild }
    );
    const [modalData, setModalData] = React.useState<Date | null>(null);


    /**
    * TODO: Fix dates
    */
    const eventPropGetter = useCallback(
        (event, start, end, isSelected) => (
            {
                ...({
                    className: 'bg-primary rounded'
                }),
                ...(moment(start).hour() <= 1 && {
                    className: 'bg-warning',
                }),
                ...(moment(end).day() < new Date().getDay() && {
                    className: 'bg-success',
                }),
                ...(isSelected && {
                    // set bg-info to important
                    className: 'bg-info outline-1',
                }),
            }),
        []
    )


    if (isLoading) return null;

    const handleDateClick = (currentDate: Date) => {
        setModalData(currentDate);
        onOpen();
    };

    return (
        <>
            <BoxWrapper>
                <Calendar
                    onDrillDown={handleDateClick}
                    localizer={localizer}
                    events={data.data}
                    views={["month", "week", "day", "agenda"]}
                    messages={{
                        next: "Siguiente", previous: "Atrás", today: "Hoy", month: "Mes", week: "Semana", day: "Día", agenda: "Agenda", date: 'Fecha',
                        time: 'Tiempo',
                        event: 'Evento',
                        allDay: "Todo el día",

                    }}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%", width: "100%", color: "#1D1C1B" }}
                    eventPropGetter={eventPropGetter}
                    components={{
                        header: HeaderCellContent,
                        toolbar: ToolbarContent,
                        // event: EventContent,
                        // eventWrapper: ({ event, onClick, accessors, className, continuesEarlier, continuesLater, getters, isRtl, label, onDoubleClick, selected, children }) => (
                        //     <EventWrapperContent event={event} onClick={onClick} accessors={accessors} className={className}
                        //         continuesEarlier={continuesEarlier} continuesLater={continuesLater} getters={getters}
                        //         isRtl={isRtl} label={label} onDoubleClick={onDoubleClick} selected={selected}>{children}</EventWrapperContent>
                        // ),
                    }}
                />
            </BoxWrapper>
            <CreateEventModal disclosure={disclosure} currentDate={modalData!} />
        </>
    );
};

export default MyCalendar;

