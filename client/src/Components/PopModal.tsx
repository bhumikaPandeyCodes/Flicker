import React from 'react'
import { isLogedIn, modalStatus,showModal } from './Atoms'
import Login from './Login'
import {useRecoilValue,useSetRecoilState } from 'recoil'
import Signup from './Signup'
import Logout from './Logout'


const PopModal = () => {
  const modalStatusValue = useRecoilValue(modalStatus)
  const setShowModal = useSetRecoilState(showModal)
  const showModalValue = useRecoilValue(showModal)
  
  const logedIn = useRecoilValue(isLogedIn)
  
  // setShowModal(true)
  console.log("In popModal ",showModalValue)
  
  if(logedIn && modalStatusValue==="signup")
  {
      return <Signup />
  }
   if(modalStatusValue ==="login")
  {
    return <Login/>
  }
  else {
    return <Logout/>
  }
}

export default PopModal
