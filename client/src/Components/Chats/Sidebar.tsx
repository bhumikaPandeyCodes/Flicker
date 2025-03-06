import React, {  useState } from 'react'
import ChatDisplay from './Chatdisplay'
import MatchDisplay from './MatchDisplay'
import { useRecoilValue } from 'recoil'
import { MatchedUser } from '../../utils/types'
import { showMatches } from '../../utils/Atoms'

interface Props {
  setClickedUser: React.Dispatch<React.SetStateAction<MatchedUser | null>>;
}


const Sidebar: React.FC<Props> = ({ setClickedUser }) => {
  // const userInfoVal = useRecoilValue(userInfo)
  const [viewMatch, setViewMatch] = useState(true)
  const isShowMatches = useRecoilValue(showMatches)
  

  return (
    <div className={`bg-gray-200 md:w-2/5 sm:w-1/2 w-full sm:block ${isShowMatches?"block":"hidden"} h-screen shadow-md`}>
      {/* < DashboardNav/> */}
      <div className='px-2  '>
        <div className=' w-full flex justify-between items-center'>
          <div className='OPTIONS'>
            <button
              className={`text-gray-950  font-iniria-sans text-lg mr-4  px-2 py-1 border-b-3 outline-none ${viewMatch && "border-b-pinkbg2"} `}
              onClick={()=>setViewMatch(true)}>
              Matches
            </button>
            <button 
              className={`text-gray-950 font-iniria-sans text-lg  px-2 py-1 border-b-3 outline-none ${!viewMatch && "border-b-pinkbg2"} `}
              onClick={()=>setViewMatch(false)}>
              Chat
            </button>
          </div>
          
        </div>
        
       {
        viewMatch ?<MatchDisplay setClickedUser={setClickedUser}/>
        :<ChatDisplay />
       }
        
      </div>
    </div>
  )
}
 
export default Sidebar
