import React, { useEffect } from "react";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket, setOnlineUsers } from "./redux/chatSlice";
import {
  setLikeNotification,
  setCommentNotification,
  setFollowNotification,
  setMessageNotification,
} from "./redux/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";

const App = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socket = io("http://localhost:3000", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socket));

      socket.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      // Handle all notification types
      socket.on("notification", (notification) => {
        if (notification.type === "like" || notification.type === "dislike") {
          dispatch(setLikeNotification(notification));
        } else if (notification.type === "comment") {
          dispatch(setCommentNotification(notification));
        } else if (
          notification.type === "follow" ||
          notification.type === "unfollow"
        ) {
          dispatch(setFollowNotification(notification));
        } else if (notification.type === "message") {
          dispatch(setMessageNotification(notification));
        }
      });

      return () => {
        socket.disconnect();
        dispatch(setSocket(null));
      };
    }
  }, [user, dispatch]);
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <MainLayout />
              </ProtectedRoutes>
            }
          >
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoutes>
                  <Profile />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/account/edit"
              element={
                <ProtectedRoutes>
                  <EditProfile />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoutes>
                  <ChatPage />
                </ProtectedRoutes>
              }
            />
          </Route>
          <Route
            index
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
