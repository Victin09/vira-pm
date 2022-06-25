import axios from 'axios';
import { TaskAttributes } from "@tidify/common";
import { BASE_URL } from "../constants";

export const createTask = async (data: Omit<TaskAttributes, "id">) => {
    const response = await axios.post(`${BASE_URL}/api/v1/columns/${data.colId}/tasks`, { ...data }, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true
    });
    return response.data;
    // const response = await fetch(`${BASE_URL}/api/v1/columns/${data.colId}/tasks`, {
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ ...data })
    // });
    // return response.json();
}