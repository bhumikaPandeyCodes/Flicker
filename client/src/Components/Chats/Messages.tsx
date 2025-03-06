import { useEffect, useRef, useState } from 'react'
import { userInfo } from '../../utils/Atoms';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { BACKEND_URL } from '../../../config';

interface Props {
  chatUserId: String;
  refreshTrigger: boolean
}

type MatchInfoType = {
  name: String;
  profile: String 
}

type sentMessages = {
  from_userId: String;
  timestamp: string,
  message: String;
}

type MessageHistory = {
  from_userId: String;
  timestamp: string;
  userProfile: String;
  message: String;
}


const Messages = ({chatUserId,refreshTrigger}: Props) => {
  const userInfoVal = useRecoilValue(userInfo)
  const userId = userInfoVal.userId
  const [matchInfo, setMatchInfo] = useState<MatchInfoType>()
  const [userSentMessages, setUserSentMessages] = useState<sentMessages []>()
  const [matchSentMessages, setMatchSentMessages] = useState<sentMessages []>()
  const scrollDivRef = useRef<HTMLDivElement>(null)

  const getMatchUser = async()=>{
    try{
      const response = await axios.get(`http://${BACKEND_URL}/match-user`, {
        params:{userId: chatUserId}
      })
      setMatchInfo(response.data)
      // console.log(response.data)
      // console.log(matchInfo)

  }
  catch(error){
      console.log(error)
  }
  }

  const getUserMessages = async()=>{
    try{
      const senderId = userId
      const receiverId = chatUserId
      const response = await axios.get(`http://${BACKEND_URL}/messages`, {params: {senderId, receiverId}})
      // console.log(response.data)
      setUserSentMessages(response.data)
    }
    catch(error){
      console.log(error)
    }
  }
  const getMatchMessages = async()=>{
    try{
      const senderId = chatUserId
      const receiverId = userId
      const response = await axios.get(`http://${BACKEND_URL}/messages`, {params: {senderId, receiverId}})
      // console.log(response.data)
      setMatchSentMessages(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    getMatchUser()
    getUserMessages()
    getMatchMessages()

    //LOGIC FOR SCROLLBAR TO BE AT BOTTOM
    
  },[userInfoVal, refreshTrigger])



  const messages:MessageHistory[] = []
  userSentMessages?.forEach((message)=> {
    messages.push({
      from_userId: message.from_userId,
      timestamp: message.timestamp,
      userProfile: userInfoVal.profile,
      message: message.message
    })
  })
  matchSentMessages?.forEach((message)=> {
    messages.push({
      from_userId: message.from_userId,
      timestamp: message.timestamp,
      userProfile: matchInfo?.profile ?? "" ,
      message: message.message
    })
  })
  // console.log("unsorted messages")
  // console.log(messages)
  messages.sort((message1, message2)=>{ return message1.timestamp.localeCompare(message2.timestamp)})

  useEffect(()=>{
    if(scrollDivRef.current){
      // console.log("before scroll height")
      // console.log(scrollDivRef.current.scrollTop)
      scrollDivRef.current.scrollTop = scrollDivRef.current.scrollHeight
      // console.log("after scroll height")
      console.log(scrollDivRef.current.scrollHeight)
    }
    // console.log(scrollDivRef.current?.scrollTop) 
  },[])

  const meridiemCalculator = (hours:number)=>{
    return hours>12?"PM":"AM"
  }

  const getTime = (timestamp: string)=>{
    let time = new Date(timestamp)
    let hours = time.getHours()
    let minutes = time.getMinutes().toString()
    if(minutes.length<2)
    {
      minutes = "0"+minutes
    }
    let meridiem = meridiemCalculator(hours)
    return `${hours}:${minutes} ${meridiem}`
  }
  // const oldTimestamp = new Date(messages[0].timestamp).getut

  return (
    <div className='w-full px-2 py-2 flex flex-col items-start gap-3 h-[450px]  overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-pinkbg2 scrollbar-track-gray-200'
    ref={scrollDivRef}>
      {messages.map((message, index)=>
      {
      //  const newTimestamp = message.timestamp
      //   if(newTimestamp!=oldTimestamp)
         return message.from_userId==userId?
         (
          <div className='w-full flex justify-end' key={index} >
          <div className='bg-light-pink-50 w-fit px-4 rounded-lg rounded-tr-none flex flex-col' >
            <p className='max-w-30'>{message.message}</p>
            <span className='text-[10px] text-gray-500'>{getTime(message.timestamp)}</span>
          </div>
          <img src={message.userProfile as string}
          className='h-[20px] w-[20px] object-cover rounded-full ml-1'
          alt='Your profile picture' />
      </div>):
          (
            <div className='w-full flex justify-start' key={index} >
            <img src={message.userProfile as string} 
            className='h-[20px] w-[20px] object-cover rounded-full mr-1'
            alt='Your profile picture' />
            <div className='bg-light-pink-50 w-fit px-4 rounded-lg rounded-tl-none flex flex-col '>
              <p className='max-w-30'>{message.message}</p> 
              <span className='text-[10px] text-gray-500'>{getTime(message.timestamp)}</span>
            </div>
          </div>
          )
        }
      )}
      
    </div>
  )
}

export default Messages
