import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const {suggestedUsers}=useSelector((store)=>store.auth);

  return (
    <div className='w-[320px] my-10 px-4 hidden lg:block'>
      <div className='flex items-center justify-between gap-3 mb-6 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
        <Link to={`/profile/${user?._id}`} className='flex items-center gap-3 w-full'>
          <Avatar className='w-12 h-12 border border-gray-200'>
            <AvatarImage src={user?.profilePicture} alt="post_image" className="object-cover" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <h1 className='font-semibold text-sm text-gray-900 leading-tight'>{user?.username}</h1>
            <span className='text-gray-500 text-sm truncate w-40'>{user?.bio || 'Bio here...'}</span>
          </div>
        </Link>
      </div>
      <div className='my-6'>
        <div className='flex items-center justify-between mb-4 px-2'>
          <h1 className='font-semibold text-gray-500 text-sm'>Suggested for you</h1>
          <span className='text-xs font-semibold text-gray-900 cursor-pointer hover:text-gray-600 transition-colors'>See All</span>
        </div>
        
        <div className='flex flex-col gap-3'>
        {
          suggestedUsers.map((user) => (
            <div key={user._id} className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
              <div className='flex items-center gap-3'>
                <Link to={`/profile/${user?._id}`}>
                 <Avatar className='w-10 h-10 border border-gray-100'>
                  <AvatarImage src={user?.profilePicture} alt="post_image" className="object-cover" />
                  <AvatarFallback className="text-xs">CN</AvatarFallback>
                </Avatar>
                </Link>
                <div className='flex flex-col'>
                  <h1 className='font-semibold text-sm text-gray-900 leading-none mb-1'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                  <span className='text-gray-500 text-xs truncate w-32'>{user?.bio || 'Suggested for you'}</span>
                </div>
              </div>
              <span className='text-[#0095f6] text-xs font-bold cursor-pointer hover:text-[#0074cc] transition-colors'>Follow</span>
            </div>
          ))
        }
        </div>
      </div>
    </div>
  )
}

export default RightSidebar
