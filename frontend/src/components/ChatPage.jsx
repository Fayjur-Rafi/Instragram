import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { CloudCog, MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import { setSelectedUser } from "@/redux/authSlice";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector(
    (state) => state.auth,
  );
  const { onlineUsers, messages } = useSelector((state) => state.chat);
  const [textMessage, setTextMessage] = useState("");
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `https://instragram-c3vx.onrender.com/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser?._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs font-bold ${isOnline ? "text-green-600" : "text-red-600"}`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            <Messages selectedUser={selectedUser} />
            {messages?.length === 0 && (
              <div className="flex justify-center items-center h-full text-gray-400 text-sm">
                No messages yet. Start a conversation!
              </div>
            )}
          </div>
          <div className="p-4 border-t border-t-gray-300">
            <div className="flex items-center gap-2">
              <input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                className="flex-1 border border-gray-300 p-2 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Message..."
              />
              <Button
                className="cursor-pointer"
                onClick={() => sendMessageHandler(selectedUser?._id)}
              >
                Send
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <div className="p-4 rounded-full border-2 border-black flex items-center justify-center w-24 h-24">
            <MessageCircleCode className="w-16 h-16" />
          </div>
          <h1 className="my-4 font-medium text-xl">Your messages</h1>
          <span>Send private photos and messages to a friend.</span>
        </div>
      )}
    </div>
  );
};
export default ChatPage;
