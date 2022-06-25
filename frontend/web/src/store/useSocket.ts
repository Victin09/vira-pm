import { combine } from 'zustand/middleware'
import create from 'zustand'
import { io, Socket } from 'socket.io-client'
import { BASE_URL } from '../constants';


export const useSocket = create(
    combine(
        {
            socket: null as Socket | null
        },
        (set, get) => ({
            connect: () => set((state) => {
                const socket = io(BASE_URL ? BASE_URL : "http://localhost:4000/");
                return { socket };
            }),
            disconnect: () => set((state) => {
                if (!get().socket) return { socket: get().socket };
                get().socket?.disconnect();
                return { socket: null };
            })
        })
    ),
)