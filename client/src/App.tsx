import React, { useState } from 'react'
import LandingPage from './Pages/LandingPage'
// import Home from './Components/Home'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { RecoilRoot } from 'recoil'
import Onboarding from './Pages/Onboarding'
import Dashboard from './Pages/Dashboard'
const App = () => {
  
  return (
    <BrowserRouter>
        <RecoilRoot>
          <Routes>
            <Route path='/' element={<LandingPage  />} />
            <Route path='/onboarding' element={<Onboarding  />} />
            <Route path='/dashboard' element={<Dashboard  />} />
          </Routes>
        </RecoilRoot>
    </BrowserRouter>
  )
}

export default App
