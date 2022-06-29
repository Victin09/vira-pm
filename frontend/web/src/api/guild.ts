import axios from 'axios'
import { BASE_URL } from "../constants";

export const getGuilds = async () => {
  const response = await axios.get(`${BASE_URL}/api/v1/users/guilds`, { withCredentials: true });
  return response.data;
}

export const createGuild = async (name: string) => {
  const response = await axios.post(`${BASE_URL}/api/v1/users/guilds`, { name: name }, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true
  });
  return response.data;
}

export const getMembers = async (guildId?: number) => {
  const response = await axios.get(`${BASE_URL}/api/v1/guilds/${guildId}/members`, { withCredentials: true });
  return response.data;
}

export const generateGuildInvite = async (guildId: number) => {
  const response = await axios.post(`${BASE_URL}/api/v1/guilds/${guildId}/invite`, {}, { withCredentials: true });
  return response.data;
}

export const acceptGuildInvite = async (token: string) => {
  const response = await axios.post(`${BASE_URL}/api/v1/guilds/join`, { token }, { withCredentials: true });
  return response.data;
} 