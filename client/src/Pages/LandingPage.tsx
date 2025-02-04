import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// IMPORTING IMAGES
import WomanImage from "../assets/woman.png"
import ManImage from "../assets/man.png"
import decImage from "../assets/deco.png"

// IMPORTING COMPONENTS
import Navbar from '../Components/Navbar'
// import PopModal from './PopModal'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { isLogedIn, isSignup, showModal } from '../utils/Atoms'
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
      console.log("Continue Swiping -->go to dashboard")
      navigate("/dashboard")
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
 
        <img src={WomanImage} className='md:h-[300px] sm:h-[200px] h-[150px] relative md:top-5 top-[-20px] md:left-8 sm:left-4 left-2'/>
        <div className='flex flex-col relative bottom-20 justify-center font-heading-font text-white items-center'>
        <h1 className='md:text-8xl sm:text-5xl text-3xl'>
          Find
        </h1>
       <div className='flex items-center gap-2 sm:text-3xl text-xl font-medium '>
        <span><img src={decImage} className='md:w-16 w-10'/></span>
        your 
        <span><img src={decImage} className='transform scale-x-[-1] md:w-16 w-10' /></span>
        </div>
       <h1 className='md:text-8xl sm:text-5xl text-3xl'>Flicker</h1>
        </div>
        <img src={ManImage} className='md:h-[300px] sm:h-[200px] h-[150px] relative md:top-5 top-[-20px] md:right-8 sm:right-4 right-2'  />
            
        </div>
        {!showModalValue&&<div className='text-center'>
        <p className='text-white  text-sm md:text-base mt-4 mb-2'>Find your perfect match who checks out the vibe</p>
       <button 
        onClick={()=>handleClick()}
        className='text-pinkbg2 md:text-xl text-lg font-bold font-iniria-serif md:px-6 py-2 px-3 rounded-3xl bg-white'>
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
