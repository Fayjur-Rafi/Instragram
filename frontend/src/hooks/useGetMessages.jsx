import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://instragram-c3vx.onrender.com/api/v1/message/all/${selectedUser?._id}`,
          { withCredentials: true },
        );
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [selectedUser, setMessages, dispatch]);
};

export default useGetMessages;
