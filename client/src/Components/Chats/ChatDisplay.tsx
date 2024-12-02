import React from 'react'
import ChatHeader from './ChatHeader'
import Messages from './Messages'

const ChatDisplay = () => {
  return (
    <div className='mt-2 h-[500px] shadow-lg w-full bg-gray-200 rounded-lg flex flex-col items-center justify-between gap-4'>
      <ChatHeader />
      <Messages />
    </div>
  )
}

export default ChatDisplay
