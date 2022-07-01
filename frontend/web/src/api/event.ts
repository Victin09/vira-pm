import axios from 'axios'
import { EventAttributes } from "@tidify/common";
import { BASE_URL } from "../constants";
import moment from 'moment';

export const getEvents = async (guildId?: number) => {
    if (!guildId) return;
    const response = await axios.get(`${BASE_URL}/api/v1/guilds/${guildId}/events`, { withCredentials: true });
    response.data.data.forEach((element: any) => {
        // element.start = moment(element.start, 'YYYY-MM-DD HH:mm').toDate()
        // element.end = moment(element.end, 'YYYY-MM-DD HH:mm').toDate()
        element.start = new Date(element.start)
        element.end = new Date(element.end)
        console.log('start', element.start)
        console.log('end', element.end)
    })
    return response.data;
    // const response = await fetch(`${BASE_URL}/api/v1/guilds/${guildId}/events`);
    // return response.json();
}

export const createEvent = async (data: Omit<EventAttributes, "id">) => {
    const response = await axios.post(`${BASE_URL}/api/v1/guilds/${data.guildId}/events`, { ...data }, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true
    });
    return response.data;
    // const response = await fetch(`${BASE_URL}/api/v1/guilds/${data.guildId}/events`, {
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ ...data })
    // });
    // return response.json();
}