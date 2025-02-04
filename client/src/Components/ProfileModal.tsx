import React, { useEffect } from 'react'
import { MatchedUser } from '../utils/types';
interface Props {
    setClickedUser: React.Dispatch<React.SetStateAction<MatchedUser | null>>
    clickedUser:MatchedUser | null
}



const ProfileModal: React.FC<Props> = ({ setClickedUser ,clickedUser }) => {
    const closeHandle = ()=>{
      setClickedUser(null)
      }

      useEffect(()=>{
        console.log(clickedUser)
      },[])

      

  return (
    <div className='bg-white px-5 py-2 lg:w-[700px] lg:h-[450px] sm:w-[600px] sm:h-[450px] w-[350px] h-[450px] rounded-xl  shadow-2xl z-30  flex flex-col items-center'>
        <button className='self-end hover:text-blue-500 ' 
            onClick={()=>closeHandle()}>
              X
        </button>
        <div className=' flex flex-col w-[450px] items-center justify-center'>
        <img 
        src={clickedUser?.profile as string} 
        className='md:h-[150px] md:w-[150px] h-[100px] w-[100px] object-cover rounded-full'
        />

        <p className='text-xl font-bold mt-2'>{clickedUser?.full_name}</p>
        <div className=' flex flex-col justify-center items-start mt-2 '>
        <div className='flex gap-3   my-2 '>
        <p className='text-lg font-semibold whitespace-nowrap  '>About Me: </p>
        <p className='text-lg '>{clickedUser?.about_me}
        </p>
        </div>
        <div className='flex gap-3   my-2 '>
        <p className='text-lg font-semibold   '>Gender: </p>
        <p className='text-lg '>
            {clickedUser?.gender}
        </p>
        </div>
        <div className='flex gap-3   my-2 '>
        <p className='text-lg font-semibold  '>Date of Birth: </p>
        <p className='text-lg '>
            21 July 1995
        </p>
        </div>
        </div>
        </div>
    </div>
  )
}

export default ProfileModal
