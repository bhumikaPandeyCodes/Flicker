import React from 'react'
import MatchImage from '../../assets/girl2.jpg'
const ChatHeader = () => {
  return (
    <div className='w-full'>
      <div className='w-full p-2 flex items-center shadow-md rounded-t-lg'> 
      <div className='flex items-center gap-2'>
        <img src={MatchImage} className='h-[40px] w-[40px] object-cover rounded-full' alt='your profile'/>
        <span className='text-black text-lg font-iniria-sans font-semibold tracking-normal '>Max</span>
      </div>
    </div>
    </div>
  )
}

export default ChatHeader
