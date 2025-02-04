import {useState} from 'react'
import Sidebar from '../Components/Chats/Sidebar'
import { MatchedUser } from '../utils/types'
import ProfileModal from '../Components/ProfileModal'
import DashboardNav from '../Components/Chats/DashboardNav'
import Swipe from '../Components/Swipe'
import { showMatches } from '../utils/Atoms'
const Dashboard = () => {
  // console.log(userId)
  const [clickedUser, setClickedUser] = useState<null | MatchedUser>(null)


  return (
    <div className='h-screen w-full overflow-hidden relative bg-gray-200'>

      <DashboardNav />
    <div className='h-full w-full overflow-hidden flex justify-between '>
      {!clickedUser && <Sidebar setClickedUser={setClickedUser} />}
      {clickedUser && <div className='h-[500px] w-full  flex justify-center items-center '>
      <ProfileModal setClickedUser={setClickedUser} clickedUser={clickedUser}/>
      </div>
      }

      {!clickedUser  && <Swipe />}
    </div>
    </div>

  )
}

export default Dashboard
