import {useEffect, useState} from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { userInfo } from '../utils/Atoms'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { MatchedUser } from '../utils/types'
import SwipeBtn from '../assets/left_arrow.png'
import { showMatches } from '../utils/Atoms'
// import 'dotenv/config'

const Swipe = () => {


      const [userInfoVal, setUserInfoVal] = useRecoilState(userInfo)
      const isShowMatches = useRecoilValue(showMatches)
      const [cookies, setCookie, removeCookie] = useCookies()
      const userId = cookies.userId
      // console.log(userId)
      const [potentialMatches, setPotentialMatches] = useState <(any)[]> ([])


      const getUser = async ()=>{

        try{
    
        const response = await axios.get("http://localhost:3000/user",{
          params:{userId}
        }
      )
      console.log(response.data.findUser)
        setUserInfoVal({
          userId: response.data.userId,
            about_me: response.data.about_me,
            dob_date: response.data.dob_date,
            dob_month: response.data.dob_month,
            dob_year: response.data.dob_year,
            full_name: response.data.full_name,
            gender: response.data.gender,
            interest_gender: response.data.interest_gender,
            matches: response.data.matches,
            liked_profiles: response.data.liked_profiles,
            profile: response.data.profile,
            show_gender: response.data.show_gender
        })
        // console.log(response.data.findUser)
        console.log(userInfoVal)
    
      }
      catch(err){
        console.log(err)
      }
    
      }
    
    
      const getInterestGender = async ()=>{
        if(userInfoVal.interest_gender!=""){
          try{
            const response = await axios.get("http://localhost:3000/interest-gender", 
              {params:{interest_gender: userInfoVal.interest_gender,gender:userInfoVal.gender }})
            //   console.log("getinterestgender")
            // console.log(response.data)
            // console.log(userInfoVal.matches)
            // let m =[]
            // IF USER ALREADY HAVE FEW MATCHES IN MATCH [] THEN POTENTIALMATCHES SHOULD CONTAIN THE FILTERED USER WHO DID NOT MATCHED WITH USER
            if(userInfoVal.liked_profiles?.length){
    
              //total number of genders >= matches always
                let y = response.data.filter(
                  (user:any)=> !userInfoVal.liked_profiles.some((profile)=> profile.userId==user.userId )
                ) 
                // console.log(y)
    
              setPotentialMatches(y)
            }
            else{
              setPotentialMatches(response.data)
            }
            // console.log(potentialMatches)
            // let x = response.data.filter((user)=>)
    
          }
          catch(error){
            console.log(error)
          }
      }
      }
    
      const updateLikedProfiles = async (likedUserId:String)=>{
        try{
          console.log("heyyyeyeyeye")
          const response = await axios.put("http://localhost:3000/liked-profiles",{userId:userInfoVal.userId, matchId:likedUserId})
          // console.log(response)
          if(response.data.success){
            updateMatches(likedUserId)
          }
        }
        catch(err){
          console.log(err)
        }
      }
      const updateMatches = async (matchedUserId:String) =>{ 
    
        try{
          const response = await axios.put("http://localhost:3000/update-matches", {userId:userInfoVal.userId, matchId:matchedUserId})
          console.log(response)
        }
        catch(err){
          console.log(err)
        }
    
      }
    
    
    
    useEffect(()=>{
      getUser()
    },[])
    
    useEffect(()=>{
      if(userInfoVal.interest_gender!="")
       getInterestGender()
    },[userInfoVal.interest_gender])
    
    useEffect(()=>{
        console.log(userInfoVal)
    },[1])
    
      const [swipedUser, setSwipedUser] = useState<null | String>(null)
      const [dir, setDir] = useState("")
      const [animation,setAnimation] = useState("")
      
        type userType = {
          show_gender: boolean
          userId: String; 
          about_me:String;
          dob_date:number | null;
          dob_month:number | null;
          dob_year:number | null;
          email:String;
          full_name:String;
          gender:String;
          interest_gender:String;
          profile: String;
        }
    
    
        //when right swipe -> then those users not seen in the card
        // userInfoVal -> potentialMatches (which is state when refreshed it gets changed) 
        // 
    
    
        const handleLeftSwipe = (id:String) =>{
          setDir("left")
          setAnimation("motion-translate-x-out-[-90%] motion-translate-y-out-[0%] motion-opacity-out-[0%] motion-duration-[0.50s]/translate motion-ease-spring-smooth")
          setSwipedUser(id)
    
        }
        const handleRightSwipe = (id:String) =>{
          setDir("right")
          setAnimation("motion-translate-x-out-[90%] motion-translate-y-out-[0%] motion-opacity-out-[0%] motion-duration-[0.50s]/translate motion-ease-spring-smooth")
          setSwipedUser(id)
          updateLikedProfiles(id)
          console.log("right")
        }
        const handleAnimationEnd = () => {                                                          
          setPotentialMatches((prevVal)=> prevVal.filter((user:userType)=>user.userId!=swipedUser))
          setAnimation(""); // Reset the animation class
          setSwipedUser(null)
          // console.log(potentialMatches)
          if(dir=="right")
            getUser()
    
        };
        
  return (
     <div className={`md:w-3/5 sm:w-1/2 h-screen w-full sm:flex ${isShowMatches ?"hidden":"flex"} `}>
        <div className='w-full h-screen flex flex-col justify-center items-center gap-[40px] sm:-translate-y-10 '>
    {
      potentialMatches.map((user:userType)=>
        <div className='h-[75vh]  flex justify-evenly items-center gap-44 absolute overflow-hidden ' key={user.userId as React.Key}>
          <button className=' text-white font-semibold text-center z-10 md:mr-16 sm:mr-10 mr-16 rounded-full '
          onClick={()=>handleLeftSwipe(user.userId)}
          >
            <img 
            className='h-8'
            src={SwipeBtn}/>
          </button>
         
            <div className={`md:h-[75vh] md:w-[300px] h-[68vh] w-[250px]  absolute `}>
              <div 
                style={{backgroundImage: `url(${user.profile})`}}
                className={`md:h-[62vh] md:w-[300px] h-[54vh] w-[250px]  bg-cover rounded-lg absolute ${swipedUser===user.userId?animation:""} ` }
                onAnimationEnd={handleAnimationEnd} 
              > 
              </div>
                <div className='bg-white md:h-[15vh] h-[16vh] w-full rounded-b-lg absolute z-5 p-2 bottom-2 text-black flex flex-col justify-start items-start gap-2'>
                    <div className='flex justify-between w-full'>
                        <span className='font-semibold text-xl'>{user.full_name}</span>
                        {user.show_gender && <span className='font-medium text-pinkbg1'>{user.gender}</span>}
                    </div>
                    <div> 
                        <span className='font-medium text-base text-gray-600'>About Me: </span>
                         <span className='text-sm'>{user.about_me}</span>
                    </div>
                </div>
          </div>
          <button className='text-white font-semibold text-center z-10 md:ml-16 sm:ml-10 ml-16 rounded-full'
          onClick={()=>handleRightSwipe(user.userId)}
          >
            <img 
            className='h-8 rotate-180 z-10'
            src={SwipeBtn}/>
          </button>

        </div>
        
      )

    }
     {dir?<p className='text-base text-pink-950 font-semibold font-iniria-sans text-center w-full absolute bottom-2 sm:bottom-16 md:bottom-14'>You Swiped {dir}</p>:""}

    </div>
    </div>
  )
}

export default Swipe
