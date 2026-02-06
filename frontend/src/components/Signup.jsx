import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const changeEventHandler = (evt) => {
    setInput({ ...input, [evt.target.name]: evt.target.value });
  };
  const signUpHandler = async (evt) => {
    evt.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "https://instragram-c3vx.onrender.com/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Somethisg went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sign Up
        </h2>
        <form onSubmit={signUpHandler} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={input.username}
              onChange={changeEventHandler}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-xl font-semibold hover:bg-purple-600 transition-colors cursor-pointer"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-500 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
