import useGetUserProfile from '@/hooks/useGetUserProfile'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
    const params = useParams();
    const userId = params.id;
    useGetUserProfile(userId);
    const [activeTab, setActiveTab] = useState('posts');

    const { userProfile, user } = useSelector((store) => store.auth);

    const isLoggedInUserProfile = user?._id === userProfile?._id;
    const isFollowing = false;

    const handleTabChange = (tab) => {
      setActiveTab(tab);
    }
    
    // Placeholder posts if none exist (for design visualization, though we should use real data)
    const displayedPosts  =activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='flex justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8 w-full max-w-5xl'>
        <div className='grid grid-cols-2 gap-10 sm:gap-20 place-items-start'>
            <section className='place-self-center'>
                <Avatar className='h-32 w-32 sm:h-40 sm:w-40 border-2 border-gray-200'>
                    <AvatarImage 
                      src={userProfile?.profilePicture}
                      alt="profile_photo" 
                      className="object-cover" 
                    />
                    <AvatarFallback className="text-4xl">CN</AvatarFallback>
                </Avatar>
            </section>
            <section className='flex flex-col gap-5'>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-4'>
                        <span className='text-xl sm:text-2xl font-light'>{userProfile?.username}</span>
                        {
                            isLoggedInUserProfile ? (
                                <div className='flex gap-2 items-center'>
                                  <Link to="/account/edit">
                                    <Button variant='secondary' className='h-8 px-4 text-sm font-semibold bg-gray-100 hover:bg-gray-200 cursor-pointer'>Edit profile</Button>
                                  </Link>
                                    <Button variant='secondary' className='h-8 px-4 text-sm font-semibold bg-gray-100 hover:bg-gray-200'>View archive</Button>
                                    <Button variant='secondary' className='h-8 px-4 text-sm font-semibold bg-gray-100 hover:bg-gray-200'>Ad tools</Button>
                                </div>
                            ) : (
                                <div className='flex gap-2 items-center'>
                                    {
                                        isFollowing ? (
                                            <Button variant='secondary' className='h-8 px-4 text-sm font-semibold bg-gray-100 hover:bg-gray-200 cursor-pointer'>Unfollow</Button>
                                        ) : (
                                            <Button className='h-8 px-6 text-sm font-semibold bg-[#0095f6] hover:bg-[#0074cc] text-white cursor-pointer'>Follow</Button>
                                        )
                                    }
                                    <Button variant='secondary' className='h-8 px-4 text-sm font-semibold bg-gray-100 hover:bg-gray-200 cursor-pointer'>Message</Button>
                                </div>
                            )
                        }
                    </div>
                    <div className='flex items-center gap-6 mt-2'>
                        <p><span className='font-semibold'>{userProfile?.posts?.length || 0}</span> posts</p>
                        <p><span className='font-semibold'>{userProfile?.followers?.length || 0}</span> followers</p>
                        <p><span className='font-semibold'>{userProfile?.following?.length || 0}</span> following</p>
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <span className='font-semibold text-sm'>{userProfile?.bio || 'bio here...'}</span>
                    {/* Badge or other info can go here */}
                    <span className='text-sm text-gray-600 bg-gray-100 rounded-full px-2 py-1 w-fit mt-2'>@{userProfile?.username}</span>
                </div>
            </section>
        </div>
        <div className='border-t border-t-gray-200'>
            <div className='flex items-center justify-center gap-12 text-sm uppercase tracking-widest font-semibold'>
                <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'border-t border-black' : 'text-gray-400'}`} onClick={() => handleTabChange('posts')}>Posts</span>
                <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'border-t border-black' : 'text-gray-400'}`} onClick={() => handleTabChange('saved')}>Saved</span>
                <span className={`py-3 cursor-pointer ${activeTab === 'reels' ? 'border-t border-black' : 'text-gray-400'}`} onClick={() => handleTabChange('reels')}>Reels</span>
                <span className={`py-3 cursor-pointer ${activeTab === 'tags' ? 'border-t border-black' : 'text-gray-400'}`} onClick={() => handleTabChange('tags')}>Tagged</span>
            </div>
            
            <div className='grid grid-cols-3 gap-1 sm:gap-4 mt-4'>
                {
                    displayedPosts?.map((post) => (
                        <div key={post?._id} className='relative group cursor-pointer aspect-square overflow-hidden bg-gray-100'>
                            <img src={post.image} alt="postimage" className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' />
                            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-6 text-white opacity-0 group-hover:opacity-100'>
                                <div className='flex items-center gap-2'>
                                    <Heart className='fill-white w-6 h-6' />
                                    <span className='font-bold'>{post?.likes?.length}</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <MessageCircle className='fill-white w-6 h-6' />
                                    <span className='font-bold'>{post?.comments?.length}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
      </div>
    </div>
  )
}

export default Profile