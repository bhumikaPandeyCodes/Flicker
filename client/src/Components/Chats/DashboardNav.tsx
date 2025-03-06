import {useState} from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import LogOutSVG from "../../assets/Group.png"

import { userInfo } from '../../utils/Atoms'
import { useRecoilState, useSetRecoilState } from 'recoil'
import MenuIcon from '../../assets/menu.png'
import CancelIcon from '../../assets/cancel.png'
import { showMatches } from '../../utils/Atoms'


const DashboardNav = ()=> {

  const [userInfoVal, _setUserInfoVal] = useRecoilState(userInfo)
  const [_cookies, _setCookie, removecookie] = useCookies()
  const [isShowMenu, setIsShowMenu] = useState(false)
  const setShowMatches = useSetRecoilState(showMatches)
  
  const navigate = useNavigate()
  const handleClickLogout = ()=>{
    console.log("logout pressed")
    removecookie("token")
    removecookie("userId")
    navigate("/")
  }

  return (
    <div className='md:w-2/5 sm:w-1/2 w-full md:p-3 p-2 bg-gradient-to-r from-light-pink-200 via-light-pink-300 to-pinkbg1 via-60% flex justify-between items-center'> 

      <div className='flex mt-2 items-center gap-4'>
        <img src={userInfoVal.profile as string} className='md:h-[50px] md:w-[50px] h-[35px] w-[35px] object-cover rounded-full' alt='your profile'/>
        <span className='text-white md:text-xl text-lg font-iniria-sans  tracking-wider'>{userInfoVal.full_name}</span>
      </div>
      <img 
        src={LogOutSVG} 
        className='md:h-5 h-4 mt-3 w-auto cursor-pointer sm:flex hidden' 
        alt="logout" 
        onClick={handleClickLogout}/>
      <div className='mt-2 sm:hidden flex '>
          <div className='z-20'>
             { !isShowMenu?<img 
              src={MenuIcon}
              className='h-3 w-5 z-15'
              onClick={()=>setIsShowMenu((prev)=>!prev)}
              />:
              <img 
              src={CancelIcon}
              className='h-6 w-auto z-15'
              onClick={()=>setIsShowMenu((prev)=>!prev)}         
              />}
          </div>
          <div className={`${isShowMenu?"ShowMenu":"HideMenu"} z-10`}>
              <ul>
              <li onClick={()=>{setShowMatches(true); setIsShowMenu(false)}}>Matches</li>
              <li onClick={()=>{setShowMatches(false); setIsShowMenu(false)}}>Swipe</li>
              <li onClick={handleClickLogout}>Logout</li>
              </ul>
          </div>
          </div>
    </div>
  )
}

export default DashboardNav
