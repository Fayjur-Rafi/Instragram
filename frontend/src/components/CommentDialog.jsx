import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import UserComment from "./ui/UserComment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const handleMenuClick = (action) => {
    console.log(`${action} clicked`);
    setShowMenu(false);
  };
  const changeEventHandler = (evt) => {
    const inputText = evt.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `https://instragram-c3vx.onrender.com/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        { withCredentials: true },
      );
      if (res.data.success) {
        const updateCommentData = [...comment, res.data.comment];
        setComment(updateCommentData);

        const updatePostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updateCommentData }
            : p,
        );
        dispatch(setPosts(updatePostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 max-h-[90vh] overflow-hidden"
        style={{ width: "1200px", height: "700px" }}
      >
        <div className="flex flex-1 h-full">
          {/* LEFT SIDE IMAGE */}
          <div className="w-1/2 bg-black flex items-center justify-center overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={selectedPost?.image}
              alt="post_image"
            />
          </div>

          {/* RIGHT SIDE CONTENT + COMMENTS */}
          <div className="w-1/2 flex flex-col bg-white">
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link>
                <Avatar className="flex items-center gap-3">
                  <AvatarImage
                    src={selectedPost?.author?.profilePicture}
                    className="w-10 h-10 rounded-full"
                  />
                  <AvatarFallback className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                    CN
                  </AvatarFallback>
                </Avatar>
              </Link>

              <Link className="font-semibold text-sm">
                {selectedPost?.author?.username}
              </Link>

              <div className="relative">
                <MoreHorizontal
                  className="cursor-pointer"
                  onClick={() => setShowMenu(!showMenu)}
                />
              </div>
            </div>

            {/* MENU MODAL */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(0.5px)",
                    WebkitBackdropFilter: "blur(0.5px)",
                  }}
                  onClick={() => setShowMenu(false)}
                />

                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl w-96 z-50 overflow-hidden shadow-2xl">
                  <button
                    onClick={() => handleMenuClick("Report")}
                    className="w-full py-3 text-center text-red-500 font-bold hover:bg-gray-50 border-b border-gray-200"
                  >
                    Report
                  </button>
                  <button
                    onClick={() => handleMenuClick("Unfollow")}
                    className="w-full py-3 text-center text-red-500 font-bold hover:bg-gray-50 border-b border-gray-200"
                  >
                    Unfollow
                  </button>
                  <button
                    onClick={() => handleMenuClick("Add to favorites")}
                    className="w-full py-3 text-center hover:bg-gray-50 border-b border-gray-200"
                  >
                    Add to favorites
                  </button>
                  <button
                    onClick={() => handleMenuClick("Go to post")}
                    className="w-full py-3 text-center hover:bg-gray-50 border-b border-gray-200"
                  >
                    Go to post
                  </button>
                  <button
                    onClick={() => handleMenuClick("Share to...")}
                    className="w-full py-3 text-center hover:bg-gray-50 border-b border-gray-200"
                  >
                    Share to...
                  </button>
                  <button
                    onClick={() => handleMenuClick("Copy link")}
                    className="w-full py-3 text-center hover:bg-gray-50 border-b border-gray-200"
                  >
                    Copy link
                  </button>
                  <button
                    onClick={() => handleMenuClick("Embed")}
                    className="w-full py-3 text-center hover:bg-gray-50 border-b border-gray-200"
                  >
                    Embed
                  </button>
                  <button
                    onClick={() => handleMenuClick("About this account")}
                    className="w-full py-3 text-center hover:bg-gray-50 border-b border-gray-200"
                  >
                    About this account
                  </button>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full py-3 text-center hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            <hr />

            {/* COMMENTS LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comment.map((comment) => (
                <UserComment key={comment._id} comment={comment} />
              ))}
            </div>

            {/* COMMENT INPUT BOX */}
            <div className="border-t border-gray-200 p-4 flex items-center gap-3 bg-gray-50/40 backdrop-blur-sm">
              <input
                value={text}
                onChange={changeEventHandler}
                type="text"
                placeholder="Add a comment..."
                className="flex-1 outline-none text-sm border border-gray-300 rounded-2xl px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
              />
              <Button
                disabled={!text.trim()}
                onClick={sendMessageHandler}
                className="rounded-2xl px-5 py-2.5 shadow-md hover:shadow-lg transition text-sm font-semibold cursor-pointer"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
