import React from 'react'
import ChatDisplay from './ChatDisplay'
import DashboardNav from './DashboardNav'
import ChatInput from './ChatInput'
import Dashboard from '../../Pages/Dashboard'

const Chats = () => {
  return (
    <div className='bg-gray-200 w-1/3 shadow-md'>
      < DashboardNav/>
      <div className='p-5'>
        <div className=''>
          <button className='text-gray-950  font-iniria-sans text-lg mr-4  px-2 py-1 border-b-3 outline-none border-b-black'>Matches</button>
          <button className='text-gray-950 font-iniria-sans text-lg  px-2 py-1 border-b-3 outline-none border-b-pinkbg2'>Chat</button>
        </div>
        {/* <div className=' mt-2 h-full w-full border-2 border-blue-400 flex flex-col justify-center items-center'> */}
        <ChatDisplay />
        <ChatInput />
        {/* </div> */}
      </div>
    </div>
  )
}
 
export default Chats
