import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        onlineUsers: [],
        messages: [],
        socket: null, // Add this line
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setSocket: (state, action) => {
            state.socket = action.payload;
        }
    }
});

export const { setOnlineUsers, setMessages, setSocket } = chatSlice.actions;
export default chatSlice.reducer;