import React from 'react'

const UserComment = ({comment}) => {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8">
        <img src={comment?.author?.profilePicture} alt="profile" className="w-full h-full rounded-full object-cover cursor-pointer" />
      </div>
      <p className="text-sm">
        <span className="font-semibold mr-1 cursor-pointer">{comment?.author?.username}</span>
        {comment?.text}
      </p>
    </div>
  )
}

export default UserComment