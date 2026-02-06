import { setMessages } from "@/redux/chatSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { socket, messages } = useSelector((store) => store.chat);

    // Use ref to always have the latest messages without re-subscribing
    const messagesRef = useRef(messages);
    messagesRef.current = messages;

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            // Use ref to get latest messages to avoid stale closure
            dispatch(setMessages([...messagesRef.current, newMessage]));
        };

        // Event name is 'newMessage' (camelCase) - matching backend
        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, dispatch]);
};

export default useGetRTM;