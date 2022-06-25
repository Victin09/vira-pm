import axios from 'axios';
import { ColumnAttributes } from "@tidify/common";
import { BASE_URL } from "../constants";

export const getBoards = async (guildId?: number) => {
    if (!guildId) return;
    const response = await axios.get(`${BASE_URL}/api/v1/guilds/${guildId}/boards`, {withCredentials: true});
    return response.data;
    // const response = await fetch(`${BASE_URL}/api/v1/guilds/${guildId}/boards`);
    // return response.json();
}

export const createBoard = async (data: {title: string, guildId: number}) => {
    const response = await axios.post(`${BASE_URL}/api/v1/guilds/${data.guildId}/boards`, { title: data.title }, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true
    });
    return response.data;
    // const response = await fetch(`${BASE_URL}/api/v1/guilds/${data.guildId}/boards`, {
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ title: data.title })
    // });
    // return response.json();
}

export const getColumns = async (boardId: number) => {
    const response = await axios.get(`${BASE_URL}/api/v1/boards/${boardId}/columns`, { withCredentials: true });
    return response.data;
    // const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/columns`);
    // return response.json();
}

export const createColumn = async (data: Omit<ColumnAttributes, "id" | "amount" | "order">) => {
    const response = await axios.post(`${BASE_URL}/api/v1/boards/${data.boardId}/columns`, { name: data.name, boardId: data.boardId }, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true
    });
    return response.data;
    // const response = await fetch(`${BASE_URL}/api/v1/boards/${data.boardId}/columns`, {
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({name: data.name, boardId: data.boardId })
    // });
    // return response.json();
}