// import React, {ChangeEvent, FormEvent} from 'react'
// import { showModal } from './Atoms'
// import { useSetRecoilState } from 'recoil'




// const Signup = () => {


// const setShowModal = useSetRecoilState(showModal)

// const clickHandle = ()=>{
//   setShowModal(false)

// }

// const handleSubmit = (e: FormEvent<SubmitEvent>) =>{

//   e.preventDefault()
//   console.log("submit")
// }

//   return (
//     <div className='bg-white px-5 py-2 w-96 h-[550px] rounded-xl shadow-2xl shadow-pinkbg3 z-10 absolute bottom flex flex-col items-center'>
//       <button className='self-end hover:text-blue-500 ' 
//         onClick={()=>clickHandle()}>
//           X
//       </button>
//     <p className='mb-5 text-3xl font-iniria-serif font-semibold '>Create an account</p>
  
//   <form onSubmit={handleSubmit}>

//     <input
//     type="email"
//     onChange={()=>onChangeEmail()}
//     className='border-2 border-gray-400 w-full rounded-md my-2 px-3 py-1 outline-none focus:border-gray-500'
//     placeholder='Email'/>

//     <input
//     className='border-2 border-gray-400 w-full rounded-md my-2 px-3 py-1 outline-none focus:border-gray-500'
//     placeholder='First Name'/>

//     <input
//     className='border-2 border-gray-400 w-full rounded-md my-2 px-3 py-1 outline-none focus:border-gray-500'
//     placeholder='Last Name'/>
//     <input
//     className='border-2 border-gray-400 w-full rounded-md my-2 px-3 py-1 outline-none focus:border-gray-500'
//     placeholder='Dob'/>

//     <input
//     className='border-2 border-gray-400 w-full rounded-md my-2 px-3 py-1 outline-none focus:border-gray-500'
//     placeholder='Password'/>

//     <input
//     className='border-2 border-gray-400 w-full rounded-md my-2 px-3 py-1 outline-none focus:border-gray-500'
//     placeholder='Confirm Password'/>

//     <input
//     type="submit"
//     name='submit'
//     className='rounded-full w-full my-3 bg-pinkbg1 px-5 py-2 text-lg text-gray-100 cursor-pointer'
//     />
//     </form>
//     <p>Already have account? <span className='underline text-blue-700 hover:text-blue-500 cursor-pointer font-semibold'>Login</span></p>
    
//     </div>
//   )
// }

// export default Signup
