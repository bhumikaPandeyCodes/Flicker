import React, { useEffect, useState } from 'react'
import { userInfo } from '../../utils/Atoms'
import { useRecoilValue } from 'recoil'
import axios from 'axios';
import { MatchedUser } from '../../utils/types';
import { BACKEND_URL } from '../../../config';
interface Props {
  setClickedUser: React.Dispatch<React.SetStateAction<MatchedUser | null>>;
}


const MatchDisplay: React.FC<Props> = ({ setClickedUser }) => {
    const userInfoVal = useRecoilValue(userInfo)
    const [matchesArray, setMatchesArray] = useState<MatchedUser[]>([])
    
     const getMatches = async function() {

      const Matches = userInfoVal.matches.map((user)=> user.userId)
      // console.log(Matches)

        try{

          //make a api call
          const response = await axios.get(`http://${BACKEND_URL}/users`,
            {
              params: {MatchesIds: JSON.stringify(Matches)}
            }
        )
        //get an array of user infos  
        setMatchesArray(response.data)
        console.log(matchesArray) 
        }
        catch(error){
          console.log(error)
        }


     }

    useEffect(()=>{
      {userInfoVal && getMatches()}
    },[userInfoVal.matches])

    
  return (
    <div className='w-full mt-1'>
      
    <div className=' w-full h-[100px] flex gap-1 overflow-x-scroll whitespace-nowrap  scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-pinkbg2 scrollbar-track-gray-200 '>

    {matchesArray.map((user, index)=>{
      return (
      <div className='mr-2 p-1 w-fit flex flex-col justify-center items-center gap-1 cursor-pointer hover:-translate-y-[2px] hover:font-bold ease-in-out duration-300 rounded-md' key={index} onClick={()=>setClickedUser(user)}>
        <img 
          src={user.profile as string}
          alt='user profile' 
          className='h-[40px] w-[40px]  object-cover border-2 border-pinkbg2 rounded-full'
        />
        <p className='font-medium text-sm text-center'>{user.full_name}</p>
      </div>
      )
    })}

       
       
    </div>
    </div>

  )
}

export default MatchDisplay
