import axios from 'axios'
import React, { FormEvent, useState } from 'react'
import {useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
// import 'dotenv/config'

const Onboarding = () => {

  type ErrorType = {
    type: string,
    message:string
  }

  const Months = ["January", "February", "March", "April", "May", "June","July","August","September","October","November","December"]
  // const URL = process.env.backend_url
  const [cookies, setCookie, removeCookies] = useCookies()
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
  
  // const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
  //   const { name, value, type, files } = e.currentTarget;
  //   console.log("image uplaoded")
  //   if (type === 'file' && files) {
  //     setFormData(prevState => ({ ...prevState, [name]: files[0] }));
  //   } else {
  //     setFormData(prevState => ({ ...prevState, [name]: value }));
  //   }
  // };

  const handleChange = (e:React.FormEvent<HTMLInputElement>) =>{
    var name = e.currentTarget.name 
    var value = e.currentTarget.type==="checkbox"? e.currentTarget.checked:e.currentTarget.value
    setFormData(prevState=>({...prevState,[name]:value }))
    // console.log(formData);
    
    // console.log("change");
    
  }

  const handleSubmit = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    console.log(formData)

    try{
      const response =await axios.put("http://localhost:3000/user",{formData})
      const success = response.status == 200
      success?navigate("/dashboard"):setError({type:"submit",message: "some error occured"})
      console.log(response)
    }
    catch(err){
      console.log(err)
      setError({type:"submit",message:"error caught"})

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
              <label htmlFor='Profile' className='font-semibold text-xl mb-4'>Profile</label>
                <input
                  className='border-2 border-slate-400 rounded-md py-1 px-2 mb-10'
                    type='text'
                    name='profile'
                    required={true}
                    onChange={handleChange}
                />
                {formData.profile && <img src={formData.profile} alt="Profile Preview" />}
                {/* <img src={formData.profile && formData.profile} ></img> */}
                <input
                type='submit'
                name='submit'
                className=' w-20 mb-2 self-center px-3 py-1 rounded-full border-2 border-pinkbg2 hover:bg-pinkbg1 hover:text-white'
                />
          </div>
        </form>
      </div>
      
    </div>
  )
}

export default Onboarding
