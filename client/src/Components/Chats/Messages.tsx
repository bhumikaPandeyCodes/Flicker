import { useEffect, useRef, useState } from 'react'
import { userInfo } from '../../utils/Atoms';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { BACKEND_URL } from '../../../config';
// import { io } from "socket.io-client";
import socket from "../../utils/socketutils"
// const socket = io("http://localhost:3000");
interface Props {
  chatUserId: String;
  // refreshTrigger: boolean
}

type MatchInfoType = {
  name: String;
  profile: String
}

// type sentMessages = {
//   from_userId: String;
//   timestamp: string,
//   message: String;
// }

type MessageHistory = {
  from_userId: String;
  timestamp: string;
  userProfile: String;
  message: String;
}


const Messages = ({ chatUserId }: Props) => {
  const userInfoVal = useRecoilValue(userInfo)
  const userId = userInfoVal.userId
  const [matchInfo, setMatchInfo] = useState<MatchInfoType>()
  const [allMessages, setAllMessages] = useState<MessageHistory[]>([]);

  const scrollDivRef = useRef<HTMLDivElement>(null)

  const getMatchUser = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/match-user`, {
        params: { userId: chatUserId }
      })
      setMatchInfo(response.data)
      matchInfo
      // console.log(response.data)
      // console.log(matchInfo)

    }
    catch (error) {
      console.log(error)
    }
  }


  const fetchChatHistory = async () => {
    try {
      const [sentRes, receivedRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/messages`, { params: { senderId: userId, receiverId: chatUserId } }),
        axios.get(`${BACKEND_URL}/messages`, { params: { senderId: chatUserId, receiverId: userId } })
      ]);

      const history = [...(sentRes.data || []), ...(receivedRes.data || [])];

      // Messages format 
      const formattedHistory = history.map((msg) => ({
        from_userId: msg.from_userId,
        timestamp: msg.timestamp,
        message: msg.message,
        userProfile: msg.from_userId === userId ? userInfoVal.profile : "" // Profile niche update hogi
      }));

      // Sort 
      setAllMessages(formattedHistory.sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
    } catch (error) { console.log(error) }
  }


  useEffect(() => {
    getMatchUser();
    fetchChatHistory();

    // Socket room join 
    socket.emit("join_chat", { senderId: userId, receiverId: chatUserId });

    // new message
    socket.on("receive_message", (data) => {
      setAllMessages((prev) => {
        // Duplicate check 
        if (prev.find(m => m.timestamp === data.timestamp)) return prev;

        const newMessage = {
          from_userId: data.from_userId,
          timestamp: data.timestamp,
          message: data.message,
          userProfile: data.from_userId === userId ? userInfoVal.profile : ""
        };
        return [...prev, newMessage];
      });
    });

    return () => {
      socket.off("receive_message");
    };
  }, [chatUserId]);

  useEffect(() => {
    if (scrollDivRef.current) {
      scrollDivRef.current.scrollTop = scrollDivRef.current.scrollHeight
      console.log(scrollDivRef.current.scrollHeight)
    }
  }, [])

  const meridiemCalculator = (hours: number) => {
    return hours > 12 ? "PM" : "AM"
  }

  const getTime = (timestamp: string) => {
    let time = new Date(timestamp)
    let hours = time.getHours()
    let minutes = time.getMinutes().toString()
    if (minutes.length < 2) {
      minutes = "0" + minutes
    }
    let meridiem = meridiemCalculator(hours)
    return `${hours}:${minutes} ${meridiem}`
  }


  return (
    <div className='w-full px-2 py-2 flex flex-col items-start gap-3 h-[450px]  overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-pinkbg2 scrollbar-track-gray-200'
      ref={scrollDivRef}>
      {allMessages.map((message, index) => {
        return message.from_userId == userId ?
          (
            <div className='w-full flex justify-end' key={index} >
              <div className='bg-light-pink-50 w-fit px-4 rounded-lg rounded-tr-none flex flex-col' >
                <p className='max-w-30'>{message.message}</p>
                <span className='text-[10px] text-gray-500'>{getTime(message.timestamp)}</span>
              </div>
              <img src={message.userProfile as string}
                className='h-[20px] w-[20px] object-cover rounded-full ml-1'
                alt='Your profile picture' />
            </div>) :
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
