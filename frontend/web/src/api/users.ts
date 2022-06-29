import axios from 'axios'
import { BASE_URL } from "../constants";

export const getUsers = async () => {
  const response = await axios.get(`${BASE_URL}/api/v1/users`, { withCredentials: true });
  console.log({ response })
  return response.data
}
