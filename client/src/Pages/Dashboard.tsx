import {useState} from 'react'
import TinderCard from 'react-tinder-card'
import Chats from '../Components/Chats/Chats'
import Girl1Image from '../assets/girl2.jpg'

const Dashboard = () => {
  const [characters, setCharacters] = useState([{
    name:'yasmine',
    image: 'https://www.goodfreephotos.com/albums/people/pretty-young-women-smiling.jpg'
  },
  {
    name:'monica',
    image: 'https://pixy.org/src/7/78764.jpg'
  },
  {
    name:"kristine",
    image: 'https://th.bing.com/th?id=OIP.ou8hY5AN1UQXUCAroz0wMQHaJl&w=219&h=284&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
  },
  {
    name:"aliza",
    image: 'https://c.stocksy.com/a/TTM800/z9/1993019.jpg'
  },
  {
    name:"yami",
    image: 'https://img.freepik.com/premium-photo/portrait-young-asian-woman-with-natural-makeup-elegant-pose_996993-14010.jpg'
  }
]
)

  const [swipedIndex, setSwipedIndex] = useState<null | number>(4)
  const [dir, setDir] = useState("")
  const [animation,setAnimation] = useState("")
  
    // const [lastDirection, setLastDirection] = useState("")

    // const swiped = (direction:string, nameToDelete:string) => {
    //   console.log('removing: ' + nameToDelete)
    //   setLastDirection(direction)
    // }

    // const outOfFrame = (name:string) => {
    //   console.log(name + ' left the screen!')
      

    // }
    type userType = {
      name: String; 
      image: String;
    }


    const handleLeftSwipe = (removeUser: userType, index:number) =>{
      setDir("left")
      setAnimation("motion-translate-x-out-[-90%] motion-translate-y-out-[0%] motion-opacity-out-[0%] motion-duration-[0.50s]/translate motion-ease-spring-smooth")
      setSwipedIndex(index)
      console.log("index: ",index)
      console.log("Swiped index: ",index)
      // console.log("direction ", dir)
      console.log("strat animation ", animation)
      // console.log("before splice object : " )
      // console.log(characters);
      // REMOVE THE USER FROM THE MATCHES
      // console.log("after splice object : " )
      // console.log(characters);
      // console.log("left")
    }
    const handleRightSwipe = () =>{
      setDir("right")

      console.log("right")
    }
    const handleAnimationEnd = () => {
      setCharacters((prevCharacters)=> prevCharacters.filter((_, index)=>index!=swipedIndex))

      setAnimation(""); // Reset the animation class
      setSwipedIndex(null)
      console.log("swiped index after: ", swipedIndex);
      console.log("end animation: ", animation);

    };
  return (
    <div className='h-screen  overflow-hidden flex justify-between'>
      <Chats />
      {/* <div className='w-2/3 overflow-hidden flex flex-col justify-center items-center  '>
        <div className='h-[60vh] w-[300px] max-w-[80vw] overflow-hidden'>
      {
        characters.map((profile)=>
          <TinderCard 
          className='absolute overflow-hidden  '
          onSwipe={(dir) => swiped(dir, profile.name)} 
          onCardLeftScreen={() => outOfFrame(profile.name)}
          >
          <div className={`bg-[url('https://www.goodfreephotos.com/albums/people/pretty-young-women-smiling.jpg')] overflow-hidden h-[60vh] w-[300px] max-w-[80vw]   rounded-md shadow-lg relative bg-cover `} >
            </div>
            <div className='bg-white p-3 rounded-b-md  relative top-[-40px]'>

            <h1 className=' font-iniria-sans font-bold'>{profile.name}</h1>
            </div>
        </TinderCard>
        )
        
      }
      </div>
      {lastDirection ? <h2 className='mt[300px]'>You swiped {lastDirection}</h2> : <h2 className='mt[300px]' />}
        
      </div> */}
        <div className='w-2/3 h-screen  flex flex-col justify-center items-center gap-[40px]'>
        {
          characters.map((user, index)=>
            <div className='w-2/3 h-[60vh]  flex justify-evenly items-center gap-20 absolute overflow-hidden' key={user.name}>
              <button className='w-10 h-10 bg-slate-600 text-white font-semibold text-center rounded-full hover:bg-slate-400'
              onClick={()=>handleLeftSwipe(user, index)}
              >
                left
              </button>
             
                <div className={`h-[60vh] w-[300px] absolute `}>
                  <div 
                    style={{backgroundImage: `url(${user.image})`}}
                    className={` h-[60vh] w-[300px] bg-cover rounded-lg relative ${swipedIndex===index?animation:""} ` }
                    onAnimationEnd={handleAnimationEnd} 
                  > 
                  <div className='bg-slate-400 h-[10vh] w-full rounded-b-lg absolute z-40 bottom-0 text-white flex justify-center items-center '>
                    <span className='font-semibold text-xl'>{user.name}</span>
                  </div>
                  </div>
              </div>
              <button className='w-10 h-10 bg-slate-600 text-white font-semibold text-center rounded-full hover:bg-slate-400'
              onClick={()=>handleRightSwipe()}
              >
                right
              </button>

            </div>
            
          )

        }
         {dir?<p className='text-lg font-medium font-iniria-sans text-center w-full   relative top-[220px]'>You Swiped {dir}</p>:""}

        </div>
    </div>
  )
}

export default Dashboard
