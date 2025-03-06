import React, { useState } from 'react'
import { userInfo } from '../../utils/Atoms';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { BACKEND_URL } from '../../../config';
interface Props {
  chatUserId: String;  
  
}


const InputMessage = ({chatUserId}:Props) => {
  
    const userInfoVal = useRecoilValue(userInfo)
    const [inputMessage, setInputMessage] = useState<string>("")
    const [error, setError] = useState<string>("")
    // const cj = setChatUserId
    // useEffect(()=>{
      // console.log(inputMessage)
    // },[])

    const sendMessage = async() =>{
      if(inputMessage==""){
        setError("Cannot send an empty message")
      }
      else{
        try{

          const response = await axios.post(`http://${BACKEND_URL}/send-message`, 
          {senderId: userInfoVal.userId, receiverId: chatUserId, message: inputMessage})
          // console.log(response.data)
          const success = response.data.success
          if(!success)
            setError("Error sending message")
        }
        catch(e){
          console.log(e)
        }
        
        setInputMessage("")
      }
      
    }

    const handlesubmit = (event:React.KeyboardEvent<HTMLInputElement>)=>{
      if(event.key=="Enter"){
        sendMessage()
      }
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
      setInputMessage(event.target.value)
      setError("")
    }
    

  return (
    <div className='w-full h-[100px] flex flex-col '>
        <div className='px-4 py-1 flex gap-2'>
        <input 
        placeholder='Type message'
        onChange={(e)=>handleChange(e)}
        onKeyDown={(e)=>handlesubmit(e)}
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
