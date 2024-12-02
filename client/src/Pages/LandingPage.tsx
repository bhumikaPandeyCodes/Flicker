import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// IMPORTING IMAGES
import WomanImage from "../assets/woman.png"
import ManImage from "../assets/man.png"
import decImage from "../assets/deco.png"

// IMPORTING COMPONENTS
// import Signup from './Signup'
import Navbar from '../Components/Navbar'
// import Login from './Login'
// import PopModal from './PopModal'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { isLogedIn, isSignup, showModal } from '../Components/Atoms'
import AuthModal from '../Components/AuthModal'
// Types:

const LandingPage = () => {
  const logedIn = useRecoilValue(isLogedIn)
  const setShowModal = useSetRecoilState(showModal)
  const showModalValue = useRecoilValue(showModal)
  const [isSignupValue, setisSignupValue] = useRecoilState(isSignup)

  // const setShowModal = useSetRecoilState(showModal)
  // console.log("in landing page ",showModalValue, isSignupValue)  
  const navigate = useNavigate();

  
  const handleClick = ()=>{
    if(logedIn)
    {
      // console.log("Continue Swiping")
      return 
    }
    else
      {
        setisSignupValue(true)
        // console.log(isSignupValue)
        setShowModal(true)
      }
  }


  return (
    <div className='h-screen p-3 overflow-hidden bg-gradient-to-b from-pinkbg1  to-pinkbg3'>

      <Navbar />

    <div className='h-full flex flex-col justify-center items-center'>
        <div className={`flex relative ${showModalValue&&"blur-[1px]"}`}>
 
        <img src={WomanImage} className='md:h-[300px] h-[200px] relative md:top-5 top-[-20px] md:left-8 left-4'/>
        <div className='flex flex-col relative bottom-20 justify-center font-heading-font text-white items-center'>
        <h1 className='md:text-8xl text-5xl '>
          Find
        </h1>
       <div className='flex items-center gap-2 text-3xl font-medium '>
        <span><img src={decImage} className='md:w-16 w-10'/></span>
        your 
        <span><img src={decImage} className='transform scale-x-[-1] md:w-16 w-10' /></span>
        </div>
       <h1 className='md:text-8xl text-5xl '>Flicker</h1>
        </div>
        <img src={ManImage} className='md:h-[300px] h-[200px] relative md:top-5 top-[-20px] md:right-8 '/>
            
        </div>
        {!showModalValue&&<div className='text-center'>
        <p className='text-white  text-sm md:text-base '>Find your perfect match who checks out the vibe</p>
       <button 
        onClick={()=>handleClick()}
        className='text-pinkbg2 text-xl font-bold font-iniria-serif md:px-6 md:py-2 px-3 py-3 rounded-3xl bg-white'>
          {logedIn?"Continue Swiping":"Find Matches"}
        </button>
        </div>
        }
        { showModalValue && <AuthModal />}  
        
      </div>
    </div>
    
    

  )
}

export default LandingPage
