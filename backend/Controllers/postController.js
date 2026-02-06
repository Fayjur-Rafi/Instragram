import sharp from "sharp";
import clooudinary from "../utils/cloudinary.js";
import { Post } from "../model/postModel.js";
import { User } from "../model/userModel.js";
import Comment from "../model/commentModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        message: "Image required",
        success: false,
      });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800 })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    const cloudinaryResponse = await clooudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudinaryResponse.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      message: "Post created successfully",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ cretedAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { cretedAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getUserAllPost = async (req, res) => {
  try {
    const authorId = req.id;

    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }

    await post.updateOne({ $addToSet: { likes: userId } });
    await post.save();
    
    // Real-time notification
    const user = await User.findById(userId).select("username profilePicture");
    const postOwnerId = post.author.toString();
    
    if (postOwnerId !== userId) {
      const notification = {
        type: 'like',
        userId: userId,
        userDetails: user,
        postId: postId,
        message: 'liked your post'
      };
      
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit('notification', notification);
      }
    }

    return res.status(200).json({
      message: "Post liked successfully",
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }

    await post.updateOne({ $pull: { likes: userId } });

    // Real-time notification
    const user = await User.findById(userId).select("username profilePicture");
    const postOwnerId = post.author.toString();
    
    if (postOwnerId !== userId) {
      const notification = {
        type: 'dislike',
        userId: userId,
        userDetails: user,
        postId: postId,
        message: 'unliked your post'
      };
      
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit('notification', notification);
      }
    }

    return res.status(200).json({
      message: "Post disliked successfully",
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!text) {
      return res.status(400).json({
        message: "text is required!",
        success: false,
      });
    }
    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    // Real-time comment notification
    const user = await User.findById(userId).select("username profilePicture");
    const postOwnerId = post.author.toString();
    
    if (postOwnerId !== userId) {
      const notification = {
        type: 'comment',
        userId: userId,
        userDetails: user,
        postId: postId,
        message: 'commented on your post',
        commentText: text
      };
      
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit('notification', notification);
      }
    }

    return res.status(201).json({
      message: "Comment added!",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture",
    });
    if (!comments) {
      return res.status(404).json({
        message: "No comments found for this post",
        success: false,
      });
    }
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }

    //check if the logged in user is the owner of the post
    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "Unauthorized!",
        success: false,
      });
    }

    //delete post
    await Post.findByIdAndDelete(postId);

    //remove the post id from the user's post

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    //delete associated comments

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted!",
    });

  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }

    const user = await User.findById(userId);

    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      return res.status(200).json({
        type: 'unsaved',
        message: 'Post removed from bookmark',
        success: true
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      return res.status(200).json({
        type: 'saved',
        message: 'Post bookmarked',
        success: true
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};
