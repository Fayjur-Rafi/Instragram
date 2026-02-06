import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);
  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          `https://instragram-c3vx.onrender.com/api/v1/message/all/${selectedUser?._id}`,
        );
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedUser?._id) fetchAllMessages();
  }, [selectedUser, dispatch]);
};
export default useGetAllMessages;
