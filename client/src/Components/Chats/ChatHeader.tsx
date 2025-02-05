import React, { useEffect, useState } from 'react'
import MatchImage from '../../assets/girl2.jpg'
import BackBtn from '../../assets/left_arrow.png'
import axios from 'axios';
import { BACKEND_URL } from '../../../config';
interface Props {
  chatUserId: String;
  setChatUserId: React.Dispatch<React.SetStateAction<String>>;
}

interface userInfoType {
  name: string;
  profile: string;
}

const ChatHeader = ({chatUserId, setChatUserId}: Props) => {
  const [userInfo, setUserInfo] = useState<userInfoType>()

  const getUser = async ()=>{
    try{
        const response = await axios.get(`http://${BACKEND_URL}/match-user`, {
          params:{userId: chatUserId}
        })
        setUserInfo(response.data)

    }
    catch(error){
        console.log(error)
    }
  }

  useEffect(()=>{
    getUser()
  },[])

  return (
    <div className='w-full h-[55px]'>
      <div className='w-full p-2 flex items-center justify-between shadow-md rounded-t-lg'> 
      <div className='flex items-center gap-2'>
        <img src={userInfo?.profile} className='h-[40px] w-[40px] object-cover rounded-full' alt='your profile'/>
        <span className='text-black text-lg font-iniria-sans font-semibold tracking-normal '>{userInfo?.name}</span>
      </div>
      <button onClick={()=>{setChatUserId("")}}>
      <img
       src={BackBtn}
       className='h-[20px] w-[20px] '
       alt="back button" />
       </button>
    </div>
    </div>
  )
}

export default ChatHeader
