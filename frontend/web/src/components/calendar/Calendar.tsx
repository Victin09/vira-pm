import { Calendar, momentLocalizer, HeaderProps, ToolbarProps } from "react-big-calendar";
import moment from "moment";
import React from "react";
import BoxWrapper from "../shared/BoxWrapper";
import { useQuery } from "react-query";
import { getEvents } from "../../api/event";
import { useSelectedGuild } from "../../store/useSelectedGuild";
import { useDisclosure } from "@chakra-ui/hooks";
import CreateEventModal from "./CreateEventModal";
import 'moment/locale/es';

const localizer = momentLocalizer(moment);

const HeaderCellContent: React.FC<HeaderProps> = ({ label }) => {
    return (
        <span className="font-semibold">
            {label.toUpperCase()}
        </span>
    );
};

const ToolbarContent: React.FC<ToolbarProps> = (toolbar) => {
    console.log({ toolbar })
    const goToBack = () => {
        toolbar.date.setMonth(toolbar.date.getMonth() - 1);
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.date.setMonth(toolbar.date.getMonth() + 1);
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        const now = new Date();
        toolbar.date.setMonth(now.getMonth());
        // toolbar.date.setYear(now.getFullYear());
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
                <button className="btn btn-primary" onClick={goToBack}>&#8249;</button>
                <button className="btn btn-primary" onClick={goToCurrent}>Hoy</button>
                <button className="btn btn-primary" onClick={goToNext}>&#8250;</button>
            </div>
            <label className="font-bold">{toolbar.label.toUpperCase()}</label>

            <div className="flex m-1">
                <button className="btn btn-primary" onClick={() => toolbar.onView("month")}>Mes</button>
                <button className="btn btn-primary" onClick={() => toolbar.onView("week")}>Semana</button>
                <button className="btn btn-primary" onClick={() => toolbar.onView("day")}>Día</button>
                <button className="btn btn-primary" onClick={() => toolbar.onView("agenda")}>Agenda</button>
            </div>
        </div >
    );
};


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

    if (isLoading) return null;

    const handleDateClick = (currentDate: Date) => {
        setModalData(currentDate);
        onOpen();
    };

    console.log({ data })

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
                    components={{
                        header: HeaderCellContent,
                        toolbar: ToolbarContent
                    }}
                />
            </BoxWrapper>
            <CreateEventModal disclosure={disclosure} currentDate={modalData!} />
        </>
    );
};

export default MyCalendar;

