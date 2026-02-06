import Conversation from "../model/conversationModel.js";
import Message from "../model/messageModel.js";
import { User } from "../model/userModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage=async(req,res)=>{
    try {
        const senderId=req.id;
        const receiverId=req.params.id;
        const {textMessage:message}=req.body;

        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        });
        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId,receiverId]
            })
        }
        const newMessage=await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
        await Promise.all([conversation.save(),newMessage.save()]);
        
        // Get sender details for notification
        const sender = await User.findById(senderId).select("username profilePicture");
        
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            // Send real-time message
            io.to(receiverSocketId).emit('newMessage',newMessage);
            
            // Send message notification
            const notification = {
                type: 'message',
                userId: senderId,
                userDetails: sender,
                message: 'sent you a message',
                messageText: message
            };
            io.to(receiverSocketId).emit('notification', notification);
        }

        return res.status(200).json({
            success:true,
            newMessage
        });
    } catch (error) {
        console.log(error);
    }
};

export const getMessage=async(req,res)=>{
    try {
        const senderId=req.id;
        const receiverId=req.params.id;
        const conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate('messages');
        if(!conversation){
            return res.status(200).json({
                success:true,
                messages:[]
            })
        };
        return res.status(200).json({
            success:true,
            messages:conversation.messages
        })
    } catch (error) {
        console.log(error);
    }
}