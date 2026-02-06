import React, { useState } from "react";
import { Bookmark, MoreHorizontal } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MessageCircle, Send } from "lucide-react";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setselectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length || 0);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (evt) => {
    const inputText = evt.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (action) => {
    setShowMenu(false);
  };

  const likeOrDislinkeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:3000/api/v1/post/${post?._id}/${action}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // Update the post in the global state
        const updatePostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user?._id],
              }
            : p,
        );
        dispatch(setPosts(updatePostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/post/${post?._id}/comment`,
        { text },
        { withCredentials: true },
      );
      console.log(res.data);
      if (res.data.success) {
        const updateCommentData = [...comment, res.data.comment];
        setComment(updateCommentData);

        const updatePostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updateCommentData } : p,
        );
        dispatch(setPosts(updatePostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id,
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true },
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
            {post.author?.profilePicture ? (
              <img
                src={post.author.profilePicture}
                alt="profile picture"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              "CN"
            )}
          </div>
          <div className="flex items-center gap-3">
            <h1>{post.author?.username || "username"}</h1>
            {user?._id === post.author._id && (
              <Badge variant="secondary" className="ml-2">
                Author
              </Badge>
            )}
          </div>
        </div>

        <div className="relative">
          <MoreHorizontal
            className="cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          />

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
                {post.author?._id !== user?._id && (
                  <>
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
                  </>
                )}

                {user && user._id === post?.author?._id && (
                  <button
                    onClick={() => {
                      handleMenuClick("Delete");
                      deletePostHandler();
                    }}
                    className="w-full py-3 text-center text-red-500 font-bold hover:bg-gray-50 border-b border-gray-200"
                  >
                    Delete
                  </button>
                )}

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
        </div>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_image"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeOrDislinkeHandler}
              size={"24px"}
              className="cursor-pointer text-red-500 hover:text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislinkeHandler}
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setselectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark
          onClick={bookmarkHandler}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>

      <span className="font-bold block mb-2">{postLike} likes</span>
      <p className="font-medium block mb-2">
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setselectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {comment.length} comments
        </span>
      )}
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
