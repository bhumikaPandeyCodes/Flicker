import {ChangeEvent,FormEvent, useState} from 'react'
import axios from 'axios'
import { showModal,isSignup } from '../utils/Atoms'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { BACKEND_URL } from '../../config'

const AuthModal = () => {
    
    const navigate = useNavigate()
    const [isSignupValue, setisSignupValue] = useRecoilState(isSignup)
    
    const [emailValue, setEmailValue]=useState("")
    const [passwordValue, setPasswordValue]=useState("")
    const [confirmPasswordValue, setConfirmPasswordValue]=useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [_cookie, setCookies, _removeCookies] = useCookies()
    
    const setShowModal = useSetRecoilState(showModal)
    // const showmodalValue = useRecoilValue(showModal)
    // console.log(" show modal", showmodalValue)
    // console.log("singupvalue", isSignupValue)
    
    // console.log("this is in authmodal")
    const closeHandle = ()=>{
      setShowModal(false)
      
    }
    
    const onChangeEmail = (e:ChangeEvent<HTMLInputElement>)=>{
      setEmailValue(e.target.value)
      
    }
    
    const onChangePassword = (e:ChangeEvent<HTMLInputElement>)=>{
      setPasswordValue(e.target.value)
    }
    const onChangeConfirmPassword = (e:ChangeEvent<HTMLInputElement>)=>{
      setConfirmPasswordValue(e.target.value)
    }
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError("")

      if (isSignupValue && (passwordValue !== confirmPasswordValue)) {
        setError("Password and Confirm Password does not match")
        return
      }

      setLoading(true)
      try {
        console.log("submit ", isSignupValue)
        const response = await axios.post(`${BACKEND_URL}/${isSignupValue ? "signup" : "login"}`, {
          email: emailValue,
          password: passwordValue
        })
        console.log("handling login request using axios")
        const success = response.status === 200
        
        if (success) {
          setCookies("token", response.data.token)
          setCookies("userId", response.data.userId)
          if (isSignupValue) {
            navigate("/onboarding")
          } else {
            navigate("/dashboard")
          }
        } else {
          setError(isSignupValue ? "Couldn't signup" : "Couldn't login")
        }
      }
      catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message)
          } else {
            setError("something went wrong")
          }
        } else {
          setError("An unexpected error occurred")
        }
      }
      finally {
        setLoading(false)
      }
    }
    
      return (
        <div className='bg-white sm:px-5 px-4 py-2 md:w-96 sm:w-80 w-64 md:h-[550px] sm:h-[500px] h-[400px] lg:rounded-xl rounded-lg shadow-2xl shadow-pinkbg3 z-30 absolute bottom flex flex-col items-center'>
          <button className='self-end hover:text-blue-500 ' 
            onClick={()=>closeHandle()}>
              X
          </button>
        <p className='mb-5 sm:text-3xl text-2xl font-iniria-serif font-semibold '>{isSignupValue?"Sign Up":"Login"}</p>
      
      <form onSubmit={handleSubmit}>
    
        <input
        type='email'
        onChange={(e)=>onChangeEmail(e)}
        placeholder='Email'
        name='email'
        required={true}
        className='border-2 border-gray-400 w-full rounded-md  sm:my-2 my-1 sm:px-3 px-2 sm:py-1 py-[2px] outline-none focus:border-gray-500'
        />
        <input 
        type='password'
        onChange={(e)=>onChangePassword(e)}
        name='password'
        required={true}
        placeholder='Password'
        className='border-2 border-gray-400 w-full rounded-md  sm:my-2 my-1 sm:px-3 px-2 sm:py-1 py-[2px] outline-none focus:border-gray-500'
        />

        {isSignupValue && <input 
        type='password'
        onChange={(e)=>onChangeConfirmPassword(e)}
        name='confirm-password'
        required={true}
        placeholder='Confirm Password'
        className='border-2 border-gray-400 w-full rounded-md  sm:my-2 my-1 sm:px-3 px-2 sm:py-1 py-[2px] outline-none focus:border-gray-500'
        />}

        <button
          type='submit'
          disabled={loading}
          className={`rounded-full w-full sm:my-3 my-2 bg-pinkbg1 px-5 sm:py-2 py-1 sm:text-lg text-gray-100 flex items-center justify-center transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]'}`}
        >
          {loading ? (
            <div className='flex items-center space-x-2 animate-pulse'>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{isSignupValue ? "Signing up..." : "Logging in..."}</span>
            </div>
          ) : (
            <span>{isSignupValue ? "Sign Up" : "Login"}</span>
          )}
        </button>
      </form>
        <p className='text-red-600' >{error ? error: ""}</p>
        {isSignupValue?
        <p>Have an account? 
          <span className='underline text-blue-700 sm:text-base text-sm hover:text-blue-500 cursor-pointer font-semibold'
          onClick={()=>{setisSignupValue(false)
          }}
          >
            Login
          </span>
        </p>
       :<p>Don't have an account?
          <span className='underline text-blue-700 sm:text-base text-sm hover:text-blue-500 cursor-pointer font-semibold'
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
