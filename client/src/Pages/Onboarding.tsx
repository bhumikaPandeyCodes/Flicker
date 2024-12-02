import React, { useState } from 'react'

const Onboarding = () => {

  const [formData, setFormData] = useState({
    full_name: "",
    dob_date: "",
    dob_month: "",
    dob_year: "",
    gender: "man",
    show_gender:false,
    interest_gender: "woman",
    about_me: "",
    profile:"",
    matches: []
  })

  const handleChange = (e:React.FormEvent<HTMLInputElement>) =>{
    var name = e.currentTarget.name 
    var value = e.currentTarget.type==="checkbox"? e.currentTarget.checked:e.currentTarget.value
    setFormData(prevState=>({...prevState,[name]:value }))
    console.log(formData);
    
    console.log("change");
    
  }

  return (
    <div className='h-screen  py-5 px-20 overflow-hidden flex flex-col font-iniria-serif'>
      <p className='font-bold text-4xl font-iniria-serif text-center'>Create Account</p>
      <div >
        <form className='w-full flex justify-between gap-20 mt-10'>
          <div className='flex flex-col w-1/2 '>
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
            <div>
              <input
                type='text'
                className='border-2 border-slate-400 rounded-md py-1 px-1  mb-10 w-16 mr-2 text-center'
                name='dob_date'
                placeholder='DD'
                required={true}
                onChange={handleChange}
                />
              <input
                type='text'
                className='border-2 border-slate-400 rounded-md py-1 px-1 mb-10 w-16 mr-2 text-center'
                name='dob_month'
                placeholder='MM'
                required={true}
                onChange={handleChange}
                />
              <input
                type='text'
                className='border-2 border-slate-400 rounded-md py-1 px-1 mb-10 w-16 mr-2 text-center'
                name='dob_year'
                placeholder='YYYY'
                required={true}
                onChange={handleChange}
                />
              </div>
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
      </div>
          
      <div className='flex flex-col w-1/2 '>
              <label htmlFor='Profile' className='font-semibold text-xl mb-4'>Profile</label>
                <input
                  className='border-2 border-slate-400 rounded-md py-1 px-2 mb-10'
                    type='text'
                    name='profile'
                    value={formData.profile}
                    placeholder='https://myself.com'
                    required={true}
                    onChange={handleChange}
                />
                <img src={formData.profile && formData.profile} ></img>
          </div>
        </form>
      </div>
      
    </div>
  )
}

export default Onboarding
