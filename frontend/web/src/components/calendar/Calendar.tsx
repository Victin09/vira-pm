import { Calendar, momentLocalizer } from "react-big-calendar";
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
                    views={["month", "week", "day"]}
                    messages={{next:"Siguiente", previous:"Atrás", today:"Hoy", month: "Mes", week: "Semana", day: "Día"}}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%", width: "100%", color: "#1D1C1B" }}
                />
            </BoxWrapper>
            <CreateEventModal disclosure={disclosure} currentDate={modalData!} />
        </>
    );
};

export default MyCalendar;

