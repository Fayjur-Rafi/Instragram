import { setAuthUser } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { setPosts } from "@/redux/postSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const {
    likeNotification = [],
    commentNotification = [],
    followNotification = [],
  } = useSelector((store) => store.realTimeNotification) || {};
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const allNotifications = [
    ...(likeNotification || []).map((n) => ({
      ...n,
      notificationType: "like",
    })),
    ...(commentNotification || []).map((n) => ({
      ...n,
      notificationType: "comment",
    })),
    ...(followNotification || []).map((n) => ({
      ...n,
      notificationType: "follow",
    })),
  ];

  const totalNotifications = allNotifications.length;

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case "comment":
        return (
          <MessageCircle className="w-5 h-5 text-blue-500 fill-blue-500" />
        );
      case "follow":
        return <UserPlus className="w-5 h-5 text-green-500" />;
      default:
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
    }
  };

  // Get background color for icon
  const getIconBg = (type) => {
    switch (type) {
      case "like":
        return "bg-red-50";
      case "comment":
        return "bg-blue-50";
      case "follow":
        return "bg-green-50";
      default:
        return "bg-gray-50";
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const createPostHandler = () => {
    setOpen(true);
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      createPostHandler();
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  const sidebarItems = [
    { icon: <Home size={22} />, text: "Home" },
    { icon: <Search size={22} />, text: "Search" },
    { icon: <TrendingUp size={22} />, text: "Explore" },
    { icon: <MessageCircle size={22} />, text: "Messages" },
    { icon: <Heart size={22} />, text: "Notifications" },
    { icon: <Plus size={22} />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6 rounded-full overflow-hidden">
          <img
            src={
              user?.profilePicture && user.profilePicture.trim() !== ""
                ? `http://localhost:3000/${user.profilePicture}`
                : "/default-profile.png"
            }
            alt="Profile"
            className="w-6 h-6 rounded-full object-cover"
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut size={22} />, text: "Logout" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white px-4 py-6">
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-semibold mb-8 px-3 font-serif tracking-tight">
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Instagram
          </span>
        </h1>

        <div className="flex flex-col gap-2 flex-1">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200 group"
            >
              <div className="text-gray-900 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-base font-normal text-gray-900">
                {item.text}
              </span>
              {item.text === "Notifications" && totalNotifications > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="relative ml-auto flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold shadow-lg hover:scale-110 transition-transform duration-200 animate-pulse">
                      {totalNotifications}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-0 rounded-xl shadow-2xl border-0 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-4 py-3">
                      <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                        <Heart className="w-4 h-4 fill-white" />
                        Notifications
                        <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-xs">
                          {totalNotifications} new
                        </span>
                      </h3>
                    </div>

                    {/* Notification Tabs */}
                    <div className="flex border-b border-gray-100 bg-gray-50">
                      <div className="flex-1 text-center py-2 text-xs font-medium text-gray-600 flex items-center justify-center gap-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        {likeNotification.length}
                      </div>
                      <div className="flex-1 text-center py-2 text-xs font-medium text-gray-600 flex items-center justify-center gap-1">
                        <MessageCircle className="w-3 h-3 text-blue-500" />
                        {commentNotification.length}
                      </div>
                      <div className="flex-1 text-center py-2 text-xs font-medium text-gray-600 flex items-center justify-center gap-1">
                        <UserPlus className="w-3 h-3 text-green-500" />
                        {followNotification.length}
                      </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto bg-white">
                      {totalNotifications === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 px-4">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <Heart className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-gray-500 text-sm">
                            No notifications yet
                          </p>
                        </div>
                      ) : (
                        allNotifications.map((notification, idx) => (
                          <div
                            key={`${notification.userId}-${idx}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-0 cursor-pointer"
                          >
                            {/* Avatar with gradient ring */}
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full p-[2px]"></div>
                              <Avatar className="w-11 h-11 rounded-full ring-2 ring-white relative">
                                <AvatarImage
                                  src={notification.userDetails?.profilePicture}
                                  className="w-11 h-11 rounded-full object-cover"
                                />
                                <AvatarFallback className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white text-sm font-semibold flex items-center justify-center">
                                  {notification.userDetails?.username
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            {/* Notification Text */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 leading-snug">
                                <span className="font-semibold hover:underline">
                                  {notification.userDetails?.username}
                                </span>{" "}
                                <span className="text-gray-600">
                                  {notification.message}
                                </span>
                              </p>
                              {notification.commentText && (
                                <p className="text-xs text-gray-500 mt-1 truncate italic">
                                  "{notification.commentText}"
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-0.5">
                                Just now
                              </p>
                            </div>

                            {/* Type Icon */}
                            <div
                              className={`flex-shrink-0 w-9 h-9 rounded-full ${getIconBg(notification.notificationType)} flex items-center justify-center`}
                            >
                              {getNotificationIcon(
                                notification.notificationType,
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
