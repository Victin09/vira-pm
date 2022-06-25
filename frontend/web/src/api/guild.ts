import axios from 'axios'
import { AndroidEditable } from 'slate-react';
import { BASE_URL } from "../constants";

export const getGuilds = async () => {
    const response = await axios.get(`${BASE_URL}/api/v1/users/guilds`, {withCredentials: true});
    return response.data;
}


// export const getGuilds = async () => {
//     const response = await fetch(`${BASE_URL}/api/v1/users/guilds`);
//     return response.json();
// }

export const createGuild = async (name: string) => {
    const response = await axios.post(`${BASE_URL}/api/v1/users/guilds`, {name: name}, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true
    });
    return response.data;
    // const response = await fetch(`${BASE_URL}/api/v1/users/guilds`, {
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ name })
    // });
    // return response.json();
}

export const getMembers = async (guildId?: number) => {
    const response = await axios.get(`${BASE_URL}/api/v1/guilds/${guildId}/members`, {withCredentials: true});
    return response.data;
    // const response = await fetch(`${BASE_URL}/api/v1/guilds/${guildId}/members`);
    // return response.json();
}
