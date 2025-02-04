import React, { Dispatch,SetStateAction, useState } from 'react'
import HeartIcon from "../assets/icon-heart.png"
import menuImage from "../assets/menu.png"
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { isLogedIn, isSignup, showModal } from '../utils/Atoms'
import AuthModal from './AuthModal'



const Navbar = () => {

  const logedIn = useRecoilValue(isLogedIn)
  const [showModalValue, setShowModalValue] = useRecoilState(showModal)
  const [isSignupValue, setIsSignupValue] = useRecoilState(isSignup)

  const handleClick = ()=>{
      if(logedIn)
      {
        //perform logout logic
        console.log("logout")
        
      }
      else{
        setIsSignupValue(false)
        //redirect to showmodal true and authmodal.tsx
        setShowModalValue(true)
        console.log("login", isSignupValue)
      }
  }
  return (
    <div className={`flex justify-between ${showModalValue&&"blur-[1px] "}`}>
      <img 
      src={HeartIcon}
      className='h-8'
      />

      <button 
      disabled={showModalValue? true: false}
      onClick={()=>handleClick()}
      className='text-white border-white sm:border-2 border-1 md:text-lg sm:text-md text-xs font-bold font-iniria-serif md:px-5 md:py-1 px-3  rounded-3xl hover:text-pinkbg3 hover:bg-white'>
        {logedIn?"Logout": "Login"}
      </button>
      </div>
  )
}

export default Navbar
