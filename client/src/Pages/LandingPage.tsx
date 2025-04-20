import { useNavigate } from 'react-router-dom'
import {easeInOut, motion} from 'motion/react'
// IMPORTING IMAGES
import WomanImage from "../assets/woman.png"
import ManImage from "../assets/man.png"
import decImage from "../assets/deco.png"
import IHead from "../assets/IHEAD.svg"
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
  const [_isSignupValue, setisSignupValue] = useRecoilState(isSignup)

  // const setShowModal = useSetRecoilState(showModal)
  // console.log("in landing page ",showModalValue, isSignupValue)  
  const navigate = useNavigate();

  
  const handleClick = ()=>{
    if(logedIn)
    {
      // console.log("Continue Swiping -->go to dashboard")
      navigate("/dashboard")
      return 
    }
    else
      {
        setisSignupValue(true)
        setShowModal(true)

      }
  }


  return (
    <div className='h-screen p-3 overflow-hidden bg-gradient-to-b from-pinkbg1  to-pinkbg3'>

      <Navbar />

    <div className='h-full flex flex-col justify-center items-center'>
        <motion.div className={`flex relative ${showModalValue&&"blur-[1px]"}`}
        initial={{opacity:0, y: -100}}
        animate={{opacity:1, y: 0, transition:{
          ease: easeInOut,
          duration: 0.5,
          delay:0.5
        }}}
        >
        <img src={WomanImage} className='md:h-[300px] sm:h-[200px] h-[150px] relative md:top-5 top-[-20px] md:left-8 sm:left-4 left-2'/>
        <div className='flex flex-col relative bottom-20 justify-center font-heading-font text-white items-center'>
        <h1 className='md:text-8xl sm:text-5xl text-3xl flex items-end relative border-w border-green-300'>
         <span>F</span><img src={IHead} className='h-[24px] md:h-[76px] sm:h-[40px] relative md:right-[1px] bottom-[6.5px] sm:bottom-[5px] md:bottom-[10.5px]'/><span>nd</span>
        </h1>
       <div className='flex items-center gap-2 sm:text-3xl text-xl font-medium '>
        <span><img src={decImage} className='md:w-16 w-10'/></span>
        your 
        <span><img src={decImage} className='transform scale-x-[-1] md:w-16 w-10' /></span>
        </div>
       <h1 className='md:text-8xl sm:text-5xl text-3xl flex items-end relative'><span>Fl</span><img src={IHead} className='md:h-[76px] sm:h-[40px] h-[24px] relative left-[1px] sm:left-[2px] md:left-[4px] bottom-[6.5px] sm:bottom-[5px] md:bottom-[10.5px]'/><span>cker</span></h1>
        </div>
        <img src={ManImage} className='md:h-[300px] sm:h-[200px] h-[150px] relative md:top-5 top-[-20px] md:right-8 sm:right-4 right-2'  />
            
        </motion.div>
        {!showModalValue&&<motion.div className='text-center'
         initial={{opacity:0}}
        animate={{opacity:1, transition:{
          ease: easeInOut,
          duration: 1,
          delay:0.5
        }
      }}>
        <p className='text-white  text-sm md:text-base mt-4 mb-2'>Find your perfect match who checks out the vibe</p>
       <button 
        onClick={()=>handleClick()}
        className='text-pinkbg2 md:text-xl text-lg font-bold font-iniria-serif md:px-6 py-2 px-3 rounded-3xl bg-white hover:bg-gray-100'>
          {logedIn?"Continue Swiping":"Find Matches"}
        </button>
        </motion.div>
        }
        { showModalValue && <AuthModal />}  
        
      </div>
    </div>
    
    

  )
}

export default LandingPage
