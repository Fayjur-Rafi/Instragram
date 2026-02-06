import { createSlice } from "@reduxjs/toolkit";

const rtnSlice=createSlice({
    name:"realTimeNotification",
    initialState:{
        likeNotification:[],
        commentNotification:[],
        followNotification:[],
        messageNotification:[],
    },
    reducers:{
        setLikeNotification:(state,action)=>{
           if(action.payload.type === "like"){
            state.likeNotification.push(action.payload);
           }else if(action.payload.type === "dislike"){
            state.likeNotification=state.likeNotification.filter((like)=>like.postId !== action.payload.postId);
               }
        },
        setCommentNotification:(state,action)=>{
            if(action.payload.type === "comment"){
                state.commentNotification.push(action.payload);
            }else if(action.payload.type === "uncomment"){
                state.commentNotification=state.commentNotification.filter((comment)=>comment.postId !== action.payload.postId);
            }
        },
        setFollowNotification:(state,action)=>{
            if(action.payload.type === "follow"){
                state.followNotification.push(action.payload);
            }else if(action.payload.type === "unfollow"){
                state.followNotification=state.followNotification.filter((follow)=>follow.userId !== action.payload.userId);
            }
        },
        setMessageNotification:(state,action)=>{
            if(action.payload.type === "message"){
                state.messageNotification.push(action.payload);
            }else if(action.payload.type === "unmessage"){
                state.messageNotification=state.messageNotification.filter((message)=>message.userId !== action.payload.userId);
            }
        }
    }
});

export const {setLikeNotification,setCommentNotification,setFollowNotification,setMessageNotification} =rtnSlice.actions;
export default rtnSlice.reducer;