import React, { useEffect, useState } from 'react'
import { userInfo } from '../../utils/Atoms'
import ChatHeader from './ChatHeader'
import Messages from './Messages'
import InputMessage from './InputMessage'

import { MatchedUser } from '../../utils/types'
import { useRecoilValue } from 'recoil'
import axios from 'axios'
import { BACKEND_URL } from '../../../config'
const ChatDisplay = () => {
    const userInfoVal = useRecoilValue(userInfo)
    const [matchesArray, setMatchesArray] = useState<MatchedUser[]>([])
    const [chatUserId, setChatUserId] = useState<String>("")
    const [refreshTrigger, setRefreshTrigger] = useState<boolean>(true) 
    
    const Matches = userInfoVal.matches.map((match)=>match.userId)
    // useEffect(()=>console.log(Matches),[])
    const getUsers = async()=>{
        try{
                const response = await axios.get(`http://${BACKEND_URL}/users`,
                    {
                        params: {MatchesIds: JSON.stringify(Matches)}
                    }
                )
                setMatchesArray(response.data)
        // console.log(matchesArray) 
                // console.log(response.data)
        }
        catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        {userInfoVal && getUsers()}
    },[userInfoVal.matches])

    setTimeout(() => {
        setRefreshTrigger((prev)=>!prev)
    }, 1000);


  return (
    <div className='w-full h-[500px] rounded-lg mt-2 p-2 '>
        {/* Show the chats between all matches */}
        {!chatUserId &&

        <div className='h-full flex flex-col gap-2'>
            { matchesArray.map((user)=>{
                return ( 
                <div className='w-full h-[50px] bg-white rounded-md px-2 flex items-center justify-between' key={user.userId as string}>
                <div className='flex items-center '>
                <img 
                src={user.profile as string}
                className='rounded-full h-[30px] w-[30px] object-cover'
                />
                <p className='text-sm ml-2 font-semibold'>{user.full_name}</p>
                </div>
                <button className='text-gray-500 mr-3  bg-gray-200 px-4 py-[2px] rounded-2xl cursor-pointer'
                onClick={()=>setChatUserId(user.userId)}
                >
                    chat
                </button>
            </div>
            )
        })
    }
        </div>
        }

        {chatUserId && 
          <div className=' h-[450px] shadow-lg w-full bg-gray-200 rounded-lg flex flex-col items-center justify-between '>
            <ChatHeader chatUserId={chatUserId} setChatUserId={setChatUserId}  />
            <Messages chatUserId={chatUserId} refreshTrigger={refreshTrigger}/>
            <InputMessage chatUserId={chatUserId} />
          </div>  
        }



    </div>
  )
}

export default ChatDisplay
