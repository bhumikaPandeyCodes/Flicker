import React, {ChangeEvent,FormEvent, useState} from 'react'
import { showModal,isSignup } from './Atoms'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const AuthModal = () => {
    
    const [isSignupValue, setisSignupValue] = useRecoilState(isSignup)
    
    const [emailValue, setEmailValue]=useState("")
    const [passwordValue, setPasswordValue]=useState("")
    const [confirmPasswordValue, setConfirmPasswordValue]=useState("")
    const [error, setError] = useState("")
    
    const setShowModal = useSetRecoilState(showModal)
    const showmodalValue = useRecoilValue(showModal)
    // console.log(" show modal", showmodalValue)
    // console.log("singupvalue", isSignupValue)
    
    const closeHandle = ()=>{
      setShowModal(false)
      
    }
    
    const onChangeEmail = (e:ChangeEvent<HTMLInputElement>)=>{
      setEmailValue(e.target.value)
      
    }
    
    const onChangePassword = (e:ChangeEvent<HTMLInputElement>)=>{
      setPasswordValue(e.target.value)
    }
    
    const handleSubmit = (e:FormEvent<SubmitEvent>)=>{
      e.preventDefault()
      // console.log(emailValue, passwordValue);
      
    }
    
      return (
        <div className='bg-white px-5 py-2 w-96 h-[550px] rounded-xl shadow-2xl shadow-pinkbg3 z-10 absolute bottom flex flex-col items-center'>
          <button className='self-end hover:text-blue-500 ' 
            onClick={()=>closeHandle()}>
              X
          </button>
        <p className='mb-5 text-3xl font-iniria-serif font-semibold '>{isSignupValue?"Sign Up":"Login"}</p>
      
      <form onSubmit={handleSubmit}>
    
        <input
        type='email'
        onChange={(e)=>onChangeEmail(e)}
        placeholder='Email'
        name='email'
        required={true}
        className='border-2 border-gray-400 w-full rounded-md my-2 px-3 py-1 outline-none focus:border-gray-500'
        />
        <input 
        type='password'
        onChange={(e)=>onChangePassword(e)}
        name='password'
        required={true}
        placeholder='Password'
        className='border-2 border-gray-400 w-full rounded-md my-2 px-3 py-1 outline-none focus:border-gray-500'
        />

        {isSignupValue && <input 
        type='password'
        onChange={(e)=>onChangePassword(e)}
        name='confirm-password'
        required={true}
        placeholder='Confirm Password'
        className='border-2 border-gray-400 w-full rounded-md my-2 px-3 py-1 outline-none focus:border-gray-500'
        />}

        <input
        type='submit'
        name='submit'
        className='rounded-full w-full my-3 bg-pinkbg1 px-5 py-2 text-lg text-gray-100'
        />
      </form>
        
        {isSignupValue?
        <p>Have an account? 
          <span className='underline text-blue-700 hover:text-blue-500 cursor-pointer font-semibold'
          onClick={()=>{setisSignupValue(false)
          }}
          >
            Login
          </span>
        </p>
       :<p>Don't have an account?
          <span className='underline text-blue-700 hover:text-blue-500 cursor-pointer font-semibold'
          onClick={()=>{setisSignupValue(true)
          }}
          >
            Sign up
          </span>
        </p>}
        
        </div>
      )
    }
    

export default AuthModal
