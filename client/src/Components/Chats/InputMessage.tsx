import React, { useState } from 'react'
import { userInfo } from '../../utils/Atoms';
import { useRecoilValue } from 'recoil';
import socket from "../../utils/socketutils"
interface Props {
  chatUserId: String;

}


const InputMessage = ({ chatUserId }: Props) => {

  const userInfoVal = useRecoilValue(userInfo)
  const [inputMessage, setInputMessage] = useState<string>("")
  const [error, setError] = useState<string>("")


  const sendMessage = async () => {
    if (inputMessage === "") return;

    const messageData = {
      senderId: userInfoVal.userId,
      receiverId: chatUserId,
      message: inputMessage,
    };

    socket.emit("send_message", messageData);


    setInputMessage("");
  };


  const handlesubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      sendMessage()
    }
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value)
    setError("")
  }


  return (
    <div className='w-full h-[100px] flex flex-col '>
      <div className='px-4 py-1 flex gap-2'>
        <input
          placeholder='Type message'
          onChange={(e) => handleChange(e)}
          onKeyDown={(e) => handlesubmit(e)}
          value={inputMessage}
          autoFocus={true}
          className='w-4/5 h-[40px] px-4 py-1 resize-none rounded-md outline-none'
        />
        <button
          className='bg-white h-[40px] px-3 py-1 rounded-md hover:bg-light-pink-200 hover:text-white hover:shadow-md'
          onClick={sendMessage}>
          Send
        </button>
      </div>
      <div className='text-red-700 text-sm mt-[-5px] mb-2 ml-4'>
        {error && <span className='text-red-700 text-sm'>{error}</span>}
      </div>
    </div>

  )
}

export default InputMessage
