import axios from 'axios'
import { BASE_URL } from "../constants";

export const getMessages = async (channelId: number) => {
    if (!channelId) return;
    const response = await axios.get(`${BASE_URL}/api/v1/channels/${channelId}/messages`, { withCredentials: true });
    return response.data;
    // const response = await fetch(`${BASE_URL}/api/v1/channels/${channelId}/messages`);
    // return response.json();
}

export const createMessage = async (data: { channelId: number, content: string }) => {
    const response = await axios.post(`${BASE_URL}/api/v1/channels/${data.channelId}/messages`, { content: data.content }, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true
    });
    return response.data;
    // const response = await fetch(`${BASE_URL}/api/v1/channels/${data.channelId}/messages`, {
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ content: data.content })
    // });
    // return response.json();
}