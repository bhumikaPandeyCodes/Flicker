import React from 'react'

const Messages = () => {
  return (
    <div className='w-full px-4 py-2 '>
      <input 
      placeholder='Type message'
      className='w-4/5 h-[40px] px-4 py-1 mr-[10px] resize-none rounded-md' 
      />
      <button className='bg-white h-[40px] px-3 py-1 rounded-md'>Send</button>
    </div>
  )
}

export default Messages
