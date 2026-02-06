import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../model/postModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing,please check!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Try different email !",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "User registered successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password!",
        success: false,
      });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({
        message: "Incorrect email or password!",
        success: false,
      });
    }
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const populatedPosts=await Promise.all(
      user.posts.map(async(postId)=>{
        const post=await Post.findById(postId);
        if(post.author.equals(user._id)){
          return post;
        }else{
          return null;
        }
      })
    );

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };
    
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user: userData,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is missing",
        success: false,
      });
    }
    const user = await User.findById(userId).select("-password").populate({path:"posts",createdAt:"-1"}).populate('bookmarks');
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Profile fetched successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "Profile updated!",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );

    if (suggestedUsers.length === 0) {
      return res.status(400).json({
        message: "Currently do not have any users!",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id;
    const jiskofollowKrunga = req.params.id;
    if (followKrneWala === jiskofollowKrunga) {
      return res.status(400).json({
        message: "You can't follow or unfollow yourself!",
        success: false,
      });
    }
    const user = await User.findById(followKrneWala).select("username profilePicture");
    const targetUser = await User.findById(jiskofollowKrunga);
    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found!",
        success: false,
      });
    }
    const isFollowing = user.following?.includes(jiskofollowKrunga);
    
    if (isFollowing) {
      await Promise.all([
        User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskofollowKrunga } }),
        User.updateOne({ _id: jiskofollowKrunga }, { $pull: { followers: followKrneWala } }),
      ]);
      
      // Real-time unfollow notification
      const notification = {
        type: 'unfollow',
        userId: followKrneWala,
        userDetails: user,
        message: 'unfollowed you'
      };
      const targetSocketId = getReceiverSocketId(jiskofollowKrunga);
      if (targetSocketId) {
        io.to(targetSocketId).emit('notification', notification);
      }
      
      return res.status(200).json({ message: "Unfollow successfully!", success: true });
    } else {
      await Promise.all([
        User.updateOne({ _id: followKrneWala }, { $push: { following: jiskofollowKrunga } }),
        User.updateOne({ _id: jiskofollowKrunga }, { $push: { followers: followKrneWala } }),
      ]);
      
      // Real-time follow notification
      const notification = {
        type: 'follow',
        userId: followKrneWala,
        userDetails: user,
        message: 'started following you'
      };
      const targetSocketId = getReceiverSocketId(jiskofollowKrunga);
      if (targetSocketId) {
        io.to(targetSocketId).emit('notification', notification);
      }
      
      return res.status(200).json({ message: "Follow successfully!", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};


