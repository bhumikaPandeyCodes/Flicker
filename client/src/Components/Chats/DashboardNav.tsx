import React from 'react'
import ProfileImage from "../../assets/guy.jpg"
import LogOutSVG from "../../assets/Group.png"

const ChatHeader = () => {
  return (
    <div className='w-full p-5 bg-gradient-to-r from-light-pink-200 via-light-pink-300 to-pinkbg1 via-60% flex justify-between items-center'> 
      <div className='flex items-center gap-4'>
        <img src={ProfileImage} className='h-[50px] w-[50px] object-cover rounded-full' alt='your profile'/>
        <span className='text-white text-xl font-iniria-sans  tracking-wider'>Max</span>
      </div>
      <img src={LogOutSVG} className='h-5 w-auto cursor-pointer' alt="logout" />
    </div>
  )
}

export default ChatHeader
