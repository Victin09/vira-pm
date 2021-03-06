import axios from 'axios'
import { BASE_URL } from "../constants";
import { ResetPassword, UserLogin, UserRegister } from "../types";

export const getMe = async () => {
  const response = await axios.get(`${BASE_URL}/api/v1/users/me`, { withCredentials: true });
  return response.data
}

export const register = async (user: UserRegister) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response.json();
};

export const login = async (user: UserLogin) => {
  const response = await axios.post(`${BASE_URL}/api/v1/auth/login`, { ...user }, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true
  });
  return response.data;
};

export const confirmCode = async (code: string) => {
  const res = await fetch(`${BASE_URL}/api/v1/auth/confirm`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
  return res.json();
};

export const reqPasswordReset = async (email: string) => {
  const res = await fetch(`/api/v1/auth/reset/password/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const resetPassword = async (data: ResetPassword) => {
  const res = await fetch(`/api/v1/auth/reset/password/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const logout = async () => {
  const res = await fetch(`/api/v1/auth/logout`, {
    method: "POST",
  });
  return res.json();
};
