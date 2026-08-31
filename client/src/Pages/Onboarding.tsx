import axios from 'axios'
import React, { FormEvent, useState } from 'react'
import {useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import {BACKEND_URL} from '../../config'
const Onboarding = () => {

  type ErrorType = {
    type: string,
    message:string
  }

  const Months = ["January", "February", "March", "April", "May", "June","July","August","September","October","November","December"]
  const [cookies, _setCookie, _removeCookies] = useCookies()
  const [error,setError] = useState<ErrorType | null>(null)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    userId: cookies.userId,
    full_name: "",
    dob_date: null,
    dob_month: null,
    dob_year: null,
    gender: "man",
    show_gender:false,
    interest_gender: "woman",
    about_me: "",
    profile: '',
    liked_profiles: [],
    matches: []
  })


  function checkDob(e:React.FormEvent<HTMLInputElement>) {
    const name = e.currentTarget.name
    const value = e.currentTarget.value
    //check if the value is a number
    if (/^\d*$/.test(value)) {
      //CHECKING DATE
      if(name==="dob_date"){
        const date = Number(value)
          //Checking the range of dates
          if(date <=31 && date>=1)
          {
            //Checking days of months are valid
            if(formData?.dob_month){
            const month = Number(formData.dob_month)
            
               if( (date>=30 && month==2) || (date>=31 && (month===4 || month===6 || month===9 || month===11 )) )
                {
                setError({type:"dob", message:`${Months[month-1]} doesn't have ${date} days. Enter valid date`})
                }
                else{
                  setError(null)
                  handleChange(e)
                }
          }
            else{
              setError(null)
              handleChange(e)
            }
          }
          else{
            setError({type:"dob", message:"Enter valid day"})
          }
    }
      // END CHECKING DATE

      //CHECKING MONTH
      else if(name==="dob_month"){
          const month = Number(value)     
          //checking month range   
          if(month>=1 && month<=12)
          {
            if(formData?.dob_date){
              const date = formData.dob_date
                if( (date>=30 && month==2) || (date>=31 && ( month===4 || month===6 || month===9 || month===11 )) )
                  {
                    setError({type:"dob", message:`${Months[month-1]} doesn't have ${date} days. Enter valid date`})
                  }
                  else{
                    setError(null)
                    handleChange(e)
                  }
              }
              else{
                  setError(null)
                  handleChange(e)
              }
          }
          else{
            setError({type:"dob", message: "Enter valid month"})
          }
      }
      //END CHECKING MONTH
      //CHECKING YEAR
      else if(name=="dob_year"){
        const year = Number(value)
        if(year>2007){
          setError({type:"dob", message:"You have to be 18+ to use this app"})
        }
        else if(year<1900){
          setError({type:"dob", message:"Enter valid year"})
        }
        else{
          setError(null)
          handleChange(e)
        }
      }
      //END CHECKING YEAR
    }
    else{
      setError({type:"dob",message:"Enter numbers only"})
    }
    
  }
  
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleChange = (e:React.FormEvent<HTMLInputElement>) =>{
    var name = e.currentTarget.name 
    var value = e.currentTarget.type==="checkbox"? e.currentTarget.checked:e.currentTarget.value
    setFormData(prevState=>({...prevState,[name]:value }))
    
    // console.log("change");
    
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profileFile) {
      setError({ type: "profile", message: "Please upload a profile photo." })
      return
    }
    console.log(formData)
    setLoading(true)

    try {
      const data = new FormData()
      data.append('userId', formData.userId || '')
      data.append('full_name', formData.full_name)
      if (formData.dob_date !== null) data.append('dob_date', String(formData.dob_date))
      if (formData.dob_month !== null) data.append('dob_month', String(formData.dob_month))
      if (formData.dob_year !== null) data.append('dob_year', String(formData.dob_year))
      data.append('gender', formData.gender)
      data.append('show_gender', String(formData.show_gender))
      data.append('interest_gender', formData.interest_gender)
      data.append('about_me', formData.about_me)
      data.append('liked_profiles', JSON.stringify(formData.liked_profiles))
      data.append('matches', JSON.stringify(formData.matches))
      
      if (profileFile) {
        data.append('profile', profileFile)
      }

      const response = await axios.put(`${BACKEND_URL}/user`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const success = response.status === 200
      success ? navigate("/dashboard") : setError({ type: "submit", message: "some error occured" })
      console.log(response)
    }
    catch (err) {
      console.log(err)
      setError({ type: "submit", message: "error caught" })
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen  py-5 sm:px-20 px-6 overflow flex flex-col font-iniria-serif'>
      <p className='font-bold sm:text-4xl text-3xl font-iniria-serif text-center'>Create Account</p>
      <div >
        <form className='w-full flex sm:flex-row flex-col sm:items-start items-center sm:justify-between sm:gap-20 mt-10' onSubmit={handleSubmit}>
          <div className='flex flex-col w-full sm:w-1/2 '>
           {/* NAME  */}
           <label htmlFor='full name' className='font-semibold text-xl mb-4'>Full Name</label>
           <input
           className='border-2 border-slate-400 rounded-md py-1 px-2 mb-10'
            type='text'
            name='full_name'
            placeholder='Full Name'
            required={true}
            onChange={handleChange}
            />
           {/* BIRTHDAY */}
           <label htmlFor='birthday' className='font-semibold text-xl mb-4'>
              Birthday
           </label>
            <div className={`${error?.type=="dob"?"mb-10":"mb-2" }`}>
              <input
                type='text'
                className='border-2 border-slate-400 rounded-md py-1 px-1   md:w-16 w-10 mr-2 text-center'
                name='dob_date'
                placeholder='DD'
                required={true}
                onChange={(e)=>checkDob(e)}
                />
              <input
                type='text'
                className='border-2 border-slate-400 rounded-md py-1 px-1  md:w-16 w-10 mr-2 text-center'
                name='dob_month'
                placeholder='MM'
                required={true}
                onChange={(e)=>{checkDob(e)}}
                />
              <input
                type='text'
                className={`border-2 border-slate-400 rounded-md py-1 px-1  md:w-16 w-10 mr-2 text-center`}
                name='dob_year'
                placeholder='YYYY'
                required={true}
                onChange={(e)=>{checkDob(e)}}
                />
              </div>
              {error?.type=="dob" && <p className='text-red-500'>{error?.message}</p>}
           {/* GENDER */}
              <label htmlFor='gender' className='font-semibold text-xl mb-4'>
                Gender
              </label>
              <div className='mb-10'>
                <label htmlFor='man_gender'> 
                  <input
                    type='radio'
                    hidden={true}
                    name='gender'
                    value="man"
                    id = "man_gender"
                    checked={formData.gender === "man"}
                    onChange={handleChange}
                    />
                    <span className='border-2 border-slate-400 text-slate-700 rounded-md px-2 py-1 mr-2 label-checked:border-pinkbg1 '>Man</span>
                  </label>
                <label htmlFor='woman_gender'> 
                  <input
                    type='radio'
                    hidden={true}
                    name='gender'
                    value="woman"
                    id = "woman_gender"
                    checked={formData.gender === "woman"}
                    onChange={handleChange}
                  />
                  <span 
                      className='border-2 border-slate-400 text-slate-700 rounded-md px-2 py-1 mr-2 label-checked:border-pinkbg1'>
                      Woman
                  </span>
                </label>
                <label htmlFor='more_gender'> 
                  <input
                    type='radio'
                    hidden={true}
                    name='gender'
                    value="more"
                    id = "more_gender"
                    checked={formData.gender === "more"}
                    onChange={handleChange}
                    />
                    <span className='border-2 border-slate-400 text-slate-700 rounded-md px-2 py-1 mr-2 label-checked:border-pinkbg1'>
                      More
                    </span>
                </label>
              </div>

           {/* SHOW GENDER CHECKBOX */}
              <div className='mb-10'>
                <label
                  htmlFor='show_gender'
                  className='font-semibold text-xl  mr-4'>
                  Show My Gender On My Profile
                </label>
                <input
                  type='checkbox'
                  name='show_gender'
                  onChange={handleChange}
                  checked={formData.show_gender}
                  />
              </div>
           {/* SELECT INTEREST GENDER */}
           <label htmlFor='interest_gender' className='font-semibold text-xl mb-4'>
                Show me 
              </label>
              <div className='mb-10'>
                <label htmlFor='man_gender_interest'> 
                  <input
                    className='hidden'
                    id="man_gender_interest"
                    type='radio'
                    name='interest_gender'
                    value="man"
                    checked={formData.interest_gender==="man"}
                    onChange={handleChange}
                    />
                    <span className='border-2 border-slate-400 text-slate-700 rounded-md px-2 py-1 mr-2 label-checked:border-pinkbg1'>
                      Man
                    </span>
                  </label>
                <label htmlFor='woman_gender_interst' >
                  <input
                    className='hidden'
                    id="woman_gender_interst"
                    type='radio'
                    name='interest_gender'
                    value="woman"
                    checked={formData.interest_gender==="woman"}
                    onChange={handleChange}
                    />
                    <span className='border-2 border-slate-400 text-slate-700 rounded-md px-2 py-1 mr-2 label-checked:border-pinkbg1'>
                      Woman
                    </span>
                  </label>
                <label htmlFor='other_gender_interest' >
                  <input
                    className='hidden'
                    id="other_gender_interest"
                    type='radio'
                    name='interest_gender'
                    value="other"
                    checked={formData.interest_gender==="other"}
                    onChange={handleChange}
                    />
                    <span className='border-2 border-slate-400 text-slate-700 rounded-md px-2 py-1 mr-2 label-checked:border-pinkbg1'>
                      Other
                    </span>
                  </label>
              </div>

           
      </div>
          
      <div className='flex flex-col w-full sm:w-1/2 '>
      {/* ABOUT ME */}
      <label htmlFor='about_me' className='font-semibold text-xl mb-4'>About Me</label>
              <input
                className='border-2 border-slate-400 rounded-md py-1 px-2 mb-10'
                  type='text'
                  name='about_me'
                  placeholder='I like long walks'
                  required={true}
                  onChange={handleChange}
                />
              <label htmlFor='profile' className='font-semibold text-xl mb-4'>Profile Photo</label>
              <div className='flex flex-col items-center justify-center border-2 border-dashed border-slate-400 rounded-lg p-6 mb-6 hover:border-pinkbg1 transition duration-200 cursor-pointer bg-slate-50 relative group'>
                <input
                  type='file'
                  accept='image/*'
                  name='profile'
                  id='profile'
                  required={true}
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                  onChange={handleFileChange}
                />
                {previewUrl ? (
                  <div className='relative w-40 h-40 group-hover:opacity-90 transition duration-200'>
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className='w-full h-full object-cover rounded-full border-4 border-pinkbg1 shadow-md'
                    />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition duration-200'>
                      <span className='text-white text-xs font-semibold'>Change Photo</span>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-center space-y-2 text-slate-500'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-12 h-12 text-slate-400 group-hover:text-pinkbg1 transition duration-200'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z'
                      />
                    </svg>
                    <span className='font-medium text-sm group-hover:text-pinkbg1 transition duration-200'>Upload a profile picture</span>
                    <span className='text-xs text-slate-400'>PNG, JPG, JPEG up to 5MB</span>
                  </div>
                )}
              </div>
              {error?.type === "profile" && <p className='text-red-500 -mt-4 mb-6 font-semibold'>{error?.message}</p>}
              <button
                type='submit'
                disabled={loading}
                className={`w-32 mb-2 self-center px-3 py-1 rounded-full border-2 border-pinkbg2 text-sm font-semibold flex items-center justify-center transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed bg-slate-100 border-slate-300 text-slate-400' : 'hover:bg-pinkbg1 hover:text-white hover:border-pinkbg1 active:scale-[0.98]'}`}
              >
                {loading ? (
                  <div className='flex items-center space-x-1.5 animate-pulse'>
                    <svg className="animate-spin h-4 w-4 text-pinkbg1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>Submit</span>
                )}
              </button>
          </div>
        </form>
      </div>
      
    </div>
  )
}

export default Onboarding
