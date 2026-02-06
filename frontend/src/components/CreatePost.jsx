import { setPosts } from "@/redux/postSlice";
import store from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  const fileChangeHandler = async (evt) => {
    const file = evt.target.files[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (evt) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setCaption("");
        setImagePreview("");
        setFile("");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Post creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] mx-4 p-0 overflow-hidden z-50 flex flex-col"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Create New Post</h2>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <Avatar className="relative">
              <AvatarImage
                src={user?.profilePicture}
                alt="img"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-100"
              />
              <AvatarFallback className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
                CN
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900 text-lg">
                {user?.username || "username"}
              </h1>
              <span className="text-sm text-gray-500">Bio here...</span>
            </div>
          </div>

          <textarea
            value={caption}
            onChange={(evt) => setCaption(evt.target.value)}
            placeholder="Write a caption..."
            className="w-full min-h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none resize-none transition-all duration-200 text-gray-900 placeholder-gray-400"
          />

          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden bg-gray-50 border-2 border-gray-200">
              <img
                src={imagePreview}
                alt="preview_img"
                className="w-full h-auto max-h-96 object-cover"
              />
              <button
                onClick={() => {
                  setImagePreview("");
                  setFile("");
                }}
                className="absolute top-3 right-3 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-2 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={fileChangeHandler}
          />
        </div>

        <div className="p-6 pt-0 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <button
              onClick={() => imageRef.current.click()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Select Photo
            </button>

            <button
              onClick={createPostHandler}
              disabled={!imagePreview}
              className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
            >
              Post
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
