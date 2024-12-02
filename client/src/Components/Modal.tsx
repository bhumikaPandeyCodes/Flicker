import React from 'react'
import { showModal } from './Atoms'
import { useSetRecoilState } from 'recoil'



const setShowModal =  useSetRecoilState(showModal)

const Modal = () => {
  return (
    <div className='bg-white px-5 py-2 w-96 h-[550px] rounded-xl shadow-2xl shadow-pinkbg3 z-10 absolute bottom flex flex-col items-center'>
      <button className='self-end hover:text-blue-500 ' 
        onClick={()=>setShowModal(false)}>
          X
      </button>
            
    </div>
  )
}

export default Modal
