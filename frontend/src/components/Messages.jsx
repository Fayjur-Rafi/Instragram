import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { useSelector } from 'react-redux'
import useGetAllMessages from '@/hooks/useGetAllMessages'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessages();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    // Format timestamp to readable format
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (!messages) return null;

    return (
        <div className='flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950'>
            {/* User Profile Header */}
            <div className='flex justify-center mb-8 pt-4'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full p-[3px] animate-pulse'></div>
                        <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-900 relative">
                            <AvatarImage src={selectedUser?.profilePicture} alt='profile' className='object-cover' />
                            <AvatarFallback className='bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl font-semibold'>
                                {selectedUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <span className='mt-3 font-semibold text-lg text-gray-800 dark:text-gray-100'>
                        {selectedUser?.username}
                    </span>
                    <span className='text-sm text-gray-500 dark:text-gray-400 mb-2'>Instagram • {selectedUser?.bio || 'No bio yet'}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button
                            className="h-9 px-6 mt-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            variant="secondary"
                        >
                            View Profile
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Messages Container */}
            <div className='flex flex-col gap-2 pb-4'>
                {messages && messages.map((msg, index) => {
                    const isSender = msg.senderId?.toString() === user?._id?.toString();
                    const showAvatar = !isSender && (index === 0 || messages[index - 1]?.senderId?.toString() !== msg.senderId?.toString());

                    return (
                        <div
                            key={msg._id}
                            className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                            {/* Receiver Avatar */}
                            {!isSender && (
                                <div className='w-7 flex-shrink-0'>
                                    {showAvatar && (
                                        <Avatar className="h-7 w-7">
                                            <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                            <AvatarFallback className='bg-gradient-to-br from-gray-400 to-gray-500 text-white text-xs'>
                                                {selectedUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div className={`group relative max-w-[70%] ${isSender ? 'order-1' : ''}`}>
                                <div
                                    className={`
                                        relative px-4 py-2.5 rounded-2xl break-words
                                        transition-all duration-200 ease-out
                                        ${isSender
                                            ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-br-md shadow-lg shadow-purple-500/20'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-md shadow-sm'
                                        }
                                        hover:scale-[1.02] hover:shadow-xl
                                    `}
                                >
                                    <p className='text-[15px] leading-relaxed'>{msg.message}</p>

                                    {/* Gradient overlay for sender messages */}
                                    {isSender && (
                                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl rounded-br-md pointer-events-none'></div>
                                    )}
                                </div>

                                {/* Timestamp - appears on hover */}
                                <span
                                    className={`
                                        absolute -bottom-5 text-[10px] text-gray-400 dark:text-gray-500
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                        ${isSender ? 'right-1' : 'left-1'}
                                    `}
                                >
                                    {formatTime(msg.createdAt)}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Add custom animation styles */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    )
}

export default Messages