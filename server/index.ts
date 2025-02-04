import { log } from "console"
import { PushOperator, Timestamp, UpdateFilter } from "mongodb";
import express from "express"
import { MongoClient } from "mongodb"
import bcrypt from "bcrypt"
import cors from "cors"
import jwt from "jsonwebtoken"
import zod from "zod"
import { v4 as uuidv4 } from "uuid"
import { exitCode } from "process"
import 'dotenv/config'
const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10): 3000
const URI = process.env.URI as string
const SALT_ROUNDS = process.env.SALT_ROUNDS? parseInt(process.env.SALT_ROUNDS, 10):10
const JWT_SECRET  = process.env.JWT_SECRET as string

const client = new MongoClient(URI)
app.use(cors())
app.use(express.json()) 
 


// SIGNUP //
app.post("/signup",async (req,res)=>{
    
    //taking the email and password - 
    const email = req.body.email
    const password = req.body.password
    const userId = uuidv4();

    //hashed password - 
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    try{
        await client.connect()
        const database = client.db("flicker")
        const users = database.collection("users")

        // CHECKING IF  EMAIL EXIST
        const existingUser = await users.findOne({email})        

        if(existingUser){
            res.status(409).send({message: "email already exist"})
            return;
        }
        // INSERTING THE USER INFO
        const response = await users.insertOne(
            {
                userId,
                email,
                password: hashedPassword
            }
        )

        // console.log(response)
        const token = jwt.sign({id:userId}, JWT_SECRET, {expiresIn:"1D"})

        res.status(200).json({"success": true, message:"Signed in successfully!",email , token, userId})
    }    
    catch(err){
        if(err instanceof jwt.JsonWebTokenError){
            res.status(500).json({message:"json webtoken error couldn't generate webtoken"})
        }
        console.log(err)
        res.status(505).json({"success": false})
    }
    finally{
        // await client.close()
    }

} )

// LOGIN //
app.post("/login", async (req,res)=>{
    //1.take the input
    const email = req.body.email;
    const password = req.body.password;
    try
    {
        
        await client.connect();
        const db = client.db("flicker")
        const user = db.collection("users")
        const findUser = await user.findOne({email})
        // console.log(findUser)
        if(!findUser){
            res.status(400).json({message:"email not found"})
            console.log("email not found")
        }
        const checkPassword = await bcrypt.compare(password, findUser?.password)
        if(!checkPassword){
            res.status(401).json({message:"Incorrect Password"})
            console.log("password incorrect")

        }
        // console.log(checkPassword)
        // GENERATING TOKEN //
        if(findUser && checkPassword){
            const token = jwt.sign({id:findUser.userId},JWT_SECRET,{expiresIn:"1d"})
            // console.log(token)
            // SENDING SUCCESS MESSAGE //
            res.status(200).json({success:true, message:"Logged in successfully!", userId:findUser.userId, token })
            console.log("log in successful and response is sent")
        }

    }
    catch(err){

        if(err instanceof Error){

            //CATCHING JWT ERROR
            if(err instanceof jwt.JsonWebTokenError){
                res.status(401).json("invalid token")
                console.log("this is invalid token found in the server")
            }
            //CATCHING MONGO NETWORK ERROR
            if(err.name == "MongoNetworkError"){
                res.status(500).json({message:"Database connection error. Please try again later."})
            }
        }
    }
})

// UPDATE USER INFO (/ONBOARDING) //
app.put("/user", async (req,res)=>{
    //GET THE INFO FROM USER
    const formData = req.body.formData
    const capitalName = formData.full_name.split(' ').map((word:string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    // console.log(formData)
    //INSERT IN THE DATABASE
    try{
        await client.connect()
        const db = client.db("flicker")
        const users = db.collection("users")
        const query = {userId: formData.userId}
        const updateDocument = {
            $set:{full_name: capitalName,
            dob_date: formData.dob_date,
            dob_month: formData.dob_month,
            dob_year: formData.dob_year,
            gender: formData.gender,
            show_gender:formData.show_gender,
            interest_gender: formData.interest_gender,
            about_me: formData.about_me,
            profile: formData.profile,
            matches: formData.matches}
        }

        const updateUser = await users.updateOne(query, updateDocument)
        if(updateUser){
            res.status(200).json(updateUser)
            // console.log("---------------update user:--------------- ")
            // console.log(updateUser)
        }

    }
    catch(err){
        console.log("//-------CAUGHT AN ERROR-------//")
        console.log(err)
    }

})


// GET USER INFO (/DASHBOARD) // 
app.get("/user", async(req,res)=>{

    const userId = req.query.userId

    try{
        await client.connect()
        const db = client.db("flicker")
        const user = db.collection("users")
        const query = {userId}
        const findUser = await user.findOne(query)

        if(findUser){
            res.status(200).json({
                userId: findUser.userId,
                about_me: findUser.about_me,
                dob_date: findUser.dob_date,
                dob_month: findUser.dob_month,
                dob_year: findUser.dob_year,
                full_name: findUser.full_name,
                gender: findUser.gender,
                interest_gender: findUser.interest_gender,
                matches: findUser.matches,
                liked_profiles: findUser.liked_profiles,
                profile: findUser.profile,
                show_gender: findUser.show_gender,
            })
        }
        // console.log(findUser)

    }
    catch(err){
        res.status(400).json({err})
        console.log(err)
    }
})

// GET INTERST GENDER FOR MATCHES (/DASHBOARD)//

app.get("/interest-gender", async(req,res) =>{
    const gender = req.query.interest_gender
    const interest_gender = req.query.gender
    try{
        await client.connect()
        const db = client.db("flicker")
        const userCollection = db.collection("users")
        const queryDocument = 
            {
                $and:[
                    {gender: gender},
                    {interest_gender: interest_gender}
                ]
            }
        
        const foundUsers =await userCollection.find(queryDocument).toArray()
        if(foundUsers){
            const sendResponse = foundUsers.map((user)=>{
                return {
                    userId:user.userId, about_me:user.about_me, dob_date:user.dob_date, dob_month:user.dob_month,dob_year:user.dob_year,
                    email:user.email,full_name:user.full_name,gender:user.gender,interest_gender:user.interest_gender, show_gender:user.show_gender,
                    profile:user.profile
                }
            })
            // console.log("---found user---")
            // console.log(sendResponse)
            res.status(200).json(sendResponse)
        }
        else
        res.status(400)

    }
    catch(error){
        console.log("---------caught an error in console---------")
        console.log(error)
    }
})

//UPDATE THE LIKED-PROFILES ARRAY FOR USER
app.put("/liked-profiles",async (req,res)=>{
    const {userId, matchId} = req.body
    //step 1 update the liked_profiles
    //step 2 check if the same user likes you
    //step 3 then update the match array

    try{
        await client.connect()
        const db = client.db("flicker")
        const userCollection = db.collection("users")
        //Update the liked_profiles for user
        
        const query = {userId: userId}
        const updateDocument = {
            $push:{liked_profiles:{userId:matchId}}  as unknown as PushOperator<Document>
        }
        const response = await userCollection.updateOne(query, updateDocument)
        if(response){  
        res.status(200).json({success: true })
    }

        //checking if the same user likes you 
    }catch(error){
        res.status(500)
        console.log(error)
    }

})

// UPDATE THE MATCH FOR THE USER
app.put("/update-matches", async(req,res)=>{
    const userId = req.body.matchId
    const matchId = req.body.userId
    try{
        await client.connect()
        //check if user like matchid user then add eachothers userid to matches array
        const db = client.db("flicker")
        const users = db.collection("users")
        const query = {userId: userId, liked_profiles: {$elemMatch: {userId: matchId}}}
        const response = await users.findOne(query)
        // console.log("update-match ongoing .....")
        // console.log(response)
        if(response){
            // console.log("users are matches now matching them.........")
            let queryDocument = {
                            $push:{matches:{userId:matchId}}  as unknown as PushOperator<Document>
                        }
        const response1 = await users.updateOne({userId:userId}, queryDocument)
             queryDocument = {
                            $push:{matches:{userId:userId}}  as unknown as PushOperator<Document>
                        }
        const response2 = await users.updateOne({userId:matchId}, queryDocument)
        res.status(200).json({success: true , response1 , response2})
    }
        
    }
    catch(err){
        console.log(err)
    }
})



//GET INFO OF MATCHES FOR THE MATCH DISPLAY
app.get("/users", async (req,res)=>{
    if(typeof req.query.MatchesIds === "string"){
        const  MatchesIds = JSON.parse(req.query.MatchesIds)
        
        try{
            // console.log(MatchesIds)
            await client.connect()
            const db = client.db("flicker")
            const userCollection = db.collection("users")
            const pipeline = [
                {
                    '$match': {
                        'userId' :{
                            '$in' : MatchesIds
                        }
                    }
                }
            ]
            const matchesArray = await userCollection.aggregate(pipeline).toArray();
            const sendResponse = matchesArray.map((user)=>{
                return {
                    userId:user.userId,
                    about_me:user.about_me,
                    email:user.email,
                    gender:user.gender,
                    full_name:user.full_name,
                    profile:user.profile,
                    dob_date: user.dob_date,
                    dob_month: user.dob_month,
                    dob_year: user.dob_year,

                }
            })
            // console.log("------------------ Matches Array ------------------")
            // console.log(sendResponse)
            
            res.json(sendResponse).status(200)
        }
        catch(error){
            // console.log("------------------ error occured ------------------")
            res.status(400)
            console.log(error)
        }
    }

})

// GET INFO OF MATCH USER FOR CHATHEADER
app.get("/match-user", async (req,res)=>{
    const userId = req.query.userId
    try{
        await client.connect()
        const db = client.db("flicker")
        const users = db.collection("users")
        const query = {userId: userId}
        const response = await users.findOne(query)
        if(response==null)
            console.log("couldn't find user")
        const sendResponse = {profile: response?.profile, name: response?.full_name}
        res.status(200).json(sendResponse)
    }
    catch(error){
        console.log("error occured in match-user")
        console.log(error)
    }
})

// GET USER MESSAGES
app.get("/messages", async (req, res)=>{
    const senderId = req.query.senderId
    const receiverId = req.query.receiverId
    // console.log(senderId)
    // console.log(receiverId)
    try{

        await client.connect()
        const db = client.db("flicker")
        const users = db.collection("messages")
        const query = {from_userId: senderId, to_userId: receiverId}
        const response = await users.find(query).toArray()

        const sendResponse = response.map((user)=>{
            let full_time = new Date(user.timestamp)
            return {from_userId: user.from_userId,
                 timestamp: user.timestamp,
                  message:user.message }
        })
        if(response){
            res.status(200).json(sendResponse)
        }
        else{
            //NO MESSAGES FROM SENDER SIDE TO RECEIVER
            res.status(200)
        }

    }
    catch(error){
        res.status(404).json(error)
    }
})


//POST USER MESSAGE
app.post("/send-message", async(req,res)=>{

    const {senderId,receiverId, message} = req.body
    const timestamp = new Date().toISOString()
    // console.log(timestamp)
    try{
        await client.connect()
        const db = client.db("flicker")
        const messages = db.collection("messages")
        const data =  {from_userId: senderId, to_userId: receiverId, timestamp:timestamp, message: message}
        const response =await messages.insertOne(data)
        if(response){
            res.status(200).json({success:true})
        }
        else{
            res.json(300).json({success: false})
        }
    }
    catch(error){
        res.json(400).json({success: false})
    }
})


app.listen(PORT, function (){
    console.log("listening")
})


