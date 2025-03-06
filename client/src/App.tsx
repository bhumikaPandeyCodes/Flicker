import LandingPage from './Pages/LandingPage'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { RecoilRoot } from 'recoil'
import Onboarding from './Pages/Onboarding'
import Dashboard from './Pages/Dashboard'
import { useCookies } from 'react-cookie'
const App = () => {
  const [cookies,_setCookie, _removeCookie] = useCookies()
  const authToken = cookies.token
  console.log("authtoken: ", authToken)
  return (
    <BrowserRouter>
        <RecoilRoot>
          <Routes>
             <Route path='/' element={<LandingPage  />} />
            {authToken && <Route path='/onboarding' element={<Onboarding  />} />}
            {authToken && <Route path='/dashboard' element={<Dashboard  />} /> }
          </Routes>
        </RecoilRoot>
    </BrowserRouter>
  )
}

export default App
