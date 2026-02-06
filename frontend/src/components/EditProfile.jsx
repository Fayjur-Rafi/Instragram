import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CloudCog, Loader2 } from "lucide-react";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [gender, setGender] = useState(user?.gender || "male");
  const imageRef = useRef();
  const [preview, setPreview] = useState(
    user?.profilePicture
      ? `http://localhost:3000/${user.profilePicture}`
      : null,
  );
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleEditProfile = async () => {
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("gender", gender);
    if (file) {
      formData.append("profilePicture", file);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        const updatedUser = {
          ...user,
          bio: res.data.user?.bio || bio,
          gender: res.data.user?.gender || gender,
          profilePicture: res.data.user?.profilePicture || user.profilePicture,
        };
        dispatch(setAuthUser(updatedUser));
        toast.success(res.data.message);
        navigate(`/profile/${user._id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mx-auto pl-10 my-8">
      <div className="flex flex-col gap-8 w-full max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h1 className="font-bold text-2xl mb-2">Edit Profile</h1>

        <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl">
          <Avatar className="h-20 w-20 border border-gray-200">
            <AvatarImage
              src={preview || user?.profilePicture}
              alt="profile_photo"
              className="object-cover"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-lg">{user?.username}</h1>
            <input
              ref={imageRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              onClick={() => imageRef.current.click()}
              className="bg-[#0095f6] hover:bg-[#0074cc] text-white h-8 px-4 font-semibold text-sm w-fit cursor-pointer"
            >
              Change photo
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-base">Bio</h1>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
              placeholder="Tell us about yourself..."
              rows="3"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-base">Gender</h1>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="custom">Custom</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="flex justify-end mt-4">
            {loading ? (
              <Button className="w-full sm:w-auto bg-[#0095f6] hover:bg-[#0074cc]">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                onClick={handleEditProfile}
                className="w-full sm:w-auto bg-[#0095f6] hover:bg-[#0074cc] h-10 px-8 font-semibold cursor-pointer"
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
