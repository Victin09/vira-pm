import axios from 'axios'
import { BASE_URL } from "../constants";

export const getChannels = async (guildId?: number) => {
    if (!guildId) return;
    const response = await axios.get(`${BASE_URL}/api/v1/guilds/${guildId}/channels`, { withCredentials: true });
    return response.data;
}

export const createChannel = async (data: {name: string, guildId: number}) => {
    const response = await axios.post(`${BASE_URL}/api/v1/guilds/${data.guildId}/channels`, { name: data.name }, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true
    });
    return response.data;
    // const response = await fetch(`${BASE_URL}/api/v1/guilds/${data.guildId}/channels`, {
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ name: data.name })
    // });
    // return response.json();
}