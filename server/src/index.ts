import { log } from "console"
import { PushOperator, Timestamp, UpdateFilter } from "mongodb";
import express from "express"
import { MongoClient } from "mongodb"
import bcrypt from "bcrypt"
import cors from "cors"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import 'dotenv/config'
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
const URI = process.env.URI as string
const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10
const JWT_SECRET = process.env.JWT_SECRET as string

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configure Multer
const storage = multer.memoryStorage()
const upload = multer({ storage })

import { createServer } from "http"; // Add this
import { Server } from "socket.io"; // Add this

const client = new MongoClient(URI)
app.use(cors({
    origin: ['https://flicker-date.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())

const httpServer = createServer(app); // Create HTTP server
const io = new Server(httpServer, {
    cors: {
        // Sirf base URLs dalein, paths (/dashboard) mat dalein
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"],
        credentials: true
    },
    // Transports ko yahan se hata dein taaki agar WS fail ho toh polling kaam kare
    // transports: ["websocket"] 
});


app.get("/", async (req, res) => {
    console.log('heyllo world')
    res.status(200).send('heloo')
})

console.log(URI)
// SIGNUP //
app.post("/signup", async (req, res) => {

    //taking the email and password - 
    const email = req.body.email
    const password = req.body.password
    const userId = uuidv4();

    //hashed password - 
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    try {
        await client.connect()
        const database = client.db("flicker")
        const users = database.collection("users")

        // CHECKING IF  EMAIL EXIST
        const existingUser = await users.findOne({ email })

        if (existingUser) {
            res.status(409).send({ message: "email already exist" })
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
        const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1D" })

        res.status(200).json({ "success": true, message: "Signed in successfully!", email, token, userId })
    }
    catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            res.status(500).json({ message: "json webtoken error couldn't generate webtoken" })
        }
        console.log(err)
        res.status(505).json({ "success": false })
    }
    finally {
        // await client.close()
    }

})

// LOGIN //
app.post("/login", async (req, res) => {
    //1.take the input
    const email = req.body.email;
    const password = req.body.password;
    try {
        await client.connect();
        const db = client.db("flicker")
        const user = db.collection("users")
        const findUser = await user.findOne({ email })
        console.log(findUser)
        if (!findUser) {
            res.status(400).json({ message: "email not found" })
            console.log("email not found")
        }
        const checkPassword = await bcrypt.compare(password, findUser?.password)
        if (!checkPassword) {
            res.status(401).json({ message: "Incorrect Password" })
            console.log("password incorrect")

        }
        // console.log(checkPassword)
        // GENERATING TOKEN //
        if (findUser && checkPassword) {
            const token = jwt.sign({ id: findUser.userId }, JWT_SECRET, { expiresIn: "1d" })
            // console.log(token)
            // SENDING SUCCESS MESSAGE //
            res.status(200).json({ success: true, message: "Logged in successfully!", userId: findUser.userId, token })
            console.log("log in successful and response is sent")
        }
        console.log("nothing hap")

    }
    catch (err) {
        console.log(err)

        if (err instanceof Error) {

            //CATCHING JWT ERROR
            if (err instanceof jwt.JsonWebTokenError) {
                res.status(401).json("invalid token")
                console.log("this is invalid token found in the server")
            }
            //CATCHING MONGO NETWORK ERROR
            if (err.name == "MongoNetworkError") {
                res.status(500).json({ message: "Database connection error. Please try again later." })
            }
        }
    }
})

// UPDATE USER INFO (/ONBOARDING) //
app.put("/user", upload.single('profile'), async (req, res) => {
    //GET THE INFO FROM USER
    const { userId, full_name, dob_date, dob_month, dob_year, gender, show_gender, interest_gender, about_me } = req.body;

    const matches = req.body.matches ? JSON.parse(req.body.matches) : [];

    const capitalName = full_name
        ? full_name.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : '';

    const parsedDobDate = dob_date ? Number(dob_date) : null;
    const parsedDobMonth = dob_month ? Number(dob_month) : null;
    const parsedDobYear = dob_year ? Number(dob_year) : null;
    const isShowGender = show_gender === "true";

    //INSERT IN THE DATABASE
    try {
        let profileUrl = '';
        if (req.file) {
            const uploadResult = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'flicker_profiles' },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                stream.write(req.file!.buffer);
                stream.end();
            });
            profileUrl = uploadResult.secure_url;
        }

        await client.connect()
        const db = client.db("flicker")
        const users = db.collection("users")
        const query = { userId: userId }

        const updateFields: any = {
            full_name: capitalName,
            dob_date: parsedDobDate,
            dob_month: parsedDobMonth,
            dob_year: parsedDobYear,
            gender: gender,
            show_gender: isShowGender,
            interest_gender: interest_gender,
            about_me: about_me,
            matches: matches
        };

        if (profileUrl) {
            updateFields.profile = profileUrl;
        }

        const updateDocument = {
            $set: updateFields
        }

        const updateUser = await users.updateOne(query, updateDocument)
        if (updateUser) {
            res.status(200).json(updateUser)
        }

    }
    catch (err) {
        console.log("//-------CAUGHT AN ERROR-------//")
        console.log(err)
        res.status(500).json({ error: "An error occurred while updating profile" })
    }

})


// GET USER INFO (/DASHBOARD) // 
app.get("/user", async (req, res) => {

    const userId = req.query.userId

    try {
        await client.connect()
        const db = client.db("flicker")
        const user = db.collection("users")
        const query = { userId }
        const findUser = await user.findOne(query)

        if (findUser) {
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
    catch (err) {
        res.status(400).json({ err })
        console.log(err)
    }
})

// GET INTERST GENDER FOR MATCHES (/DASHBOARD)//

app.get("/interest-gender", async (req, res) => {
    const gender = req.query.interest_gender
    const interest_gender = req.query.gender
    try {
        await client.connect()
        const db = client.db("flicker")
        const userCollection = db.collection("users")
        const queryDocument =
        {
            $and: [
                { gender: gender },
                { interest_gender: interest_gender }
            ]
        }

        const foundUsers = await userCollection.find(queryDocument).toArray()
        if (foundUsers) {
            const sendResponse = foundUsers.map((user) => {
                return {
                    userId: user.userId, about_me: user.about_me, dob_date: user.dob_date, dob_month: user.dob_month, dob_year: user.dob_year,
                    email: user.email, full_name: user.full_name, gender: user.gender, interest_gender: user.interest_gender, show_gender: user.show_gender,
                    profile: user.profile
                }
            })
            // console.log("---found user---")
            // console.log(sendResponse)
            res.status(200).json(sendResponse)
        }
        else
            res.status(400)

    }
    catch (error) {
        console.log("---------caught an error in console---------")
        console.log(error)
    }
})

//UPDATE THE LIKED-PROFILES ARRAY FOR USER
app.put("/liked-profiles", async (req, res) => {
    const { userId, matchId } = req.body
    //step 1 update the liked_profiles
    //step 2 check if the same user likes you
    //step 3 then update the match array

    try {
        await client.connect()
        const db = client.db("flicker")
        const userCollection = db.collection("users")
        //Update the liked_profiles for user

        const query = { userId: userId }
        const updateDocument = {
            $push: { liked_profiles: { userId: matchId } } as unknown as PushOperator<Document>
        }
        const response = await userCollection.updateOne(query, updateDocument)
        if (response) {
            res.status(200).json({ success: true })
        }

        //checking if the same user likes you 
    } catch (error) {
        res.status(500)
        console.log(error)
    }

})

// UPDATE THE MATCH FOR THE USER
app.put("/update-matches", async (req, res) => {
    const userId = req.body.matchId
    const matchId = req.body.userId
    try {
        await client.connect()
        //check if user like matchid user then add eachothers userid to matches array
        const db = client.db("flicker")
        const users = db.collection("users")
        const query = { userId: userId, liked_profiles: { $elemMatch: { userId: matchId } } }
        const response = await users.findOne(query)
        // console.log("update-match ongoing .....")
        // console.log(response)
        if (response) {
            // console.log("users are matches now matching them.........")
            let queryDocument = {
                $push: { matches: { userId: matchId } } as unknown as PushOperator<Document>
            }
            const response1 = await users.updateOne({ userId: userId }, queryDocument)
            queryDocument = {
                $push: { matches: { userId: userId } } as unknown as PushOperator<Document>
            }
            const response2 = await users.updateOne({ userId: matchId }, queryDocument)
            res.status(200).json({ success: true, response1, response2 })
        }

    }
    catch (err) {
        console.log(err)
    }
})



//GET INFO OF MATCHES FOR THE MATCH DISPLAY
app.get("/users", async (req, res) => {
    if (typeof req.query.MatchesIds === "string") {
        const MatchesIds = JSON.parse(req.query.MatchesIds)

        try {
            // console.log(MatchesIds)
            await client.connect()
            const db = client.db("flicker")
            const userCollection = db.collection("users")
            const pipeline = [
                {
                    '$match': {
                        'userId': {
                            '$in': MatchesIds
                        }
                    }
                }
            ]
            const matchesArray = await userCollection.aggregate(pipeline).toArray();
            const sendResponse = matchesArray.map((user) => {
                return {
                    userId: user.userId,
                    about_me: user.about_me,
                    email: user.email,
                    gender: user.gender,
                    full_name: user.full_name,
                    profile: user.profile,
                    dob_date: user.dob_date,
                    dob_month: user.dob_month,
                    dob_year: user.dob_year,

                }
            })
            // console.log("------------------ Matches Array ------------------")
            // console.log(sendResponse)

            res.json(sendResponse).status(200)
        }
        catch (error) {
            // console.log("------------------ error occured ------------------")
            res.status(400)
            console.log(error)
        }
    }

})

// GET INFO OF MATCH USER FOR CHATHEADER
app.get("/match-user", async (req, res) => {
    const userId = req.query.userId
    try {
        await client.connect()
        const db = client.db("flicker")
        const users = db.collection("users")
        const query = { userId: userId }
        const response = await users.findOne(query)
        if (response == null)
            console.log("couldn't find user")
        const sendResponse = { profile: response?.profile, name: response?.full_name }
        res.status(200).json(sendResponse)
    }
    catch (error) {
        console.log("error occured in match-user")
        console.log(error)
    }
})

// GET USER MESSAGES
app.get("/messages", async (req, res) => {
    const senderId = req.query.senderId
    const receiverId = req.query.receiverId
    // console.log(senderId)
    // console.log(receiverId)
    try {

        await client.connect()
        const db = client.db("flicker")
        const users = db.collection("messages")
        const query = { from_userId: senderId, to_userId: receiverId }
        const response = await users.find(query).toArray()

        const sendResponse = response.map((user) => {
            let full_time = new Date(user.timestamp)
            return {
                from_userId: user.from_userId,
                timestamp: user.timestamp,
                message: user.message
            }
        })
        if (response) {
            res.status(200).json(sendResponse)
        }
        else {
            //NO MESSAGES FROM SENDER SIDE TO RECEIVER
            res.status(200)
        }

    }
    catch (error) {
        res.status(404).json(error)
    }
})


//POST USER MESSAGE
app.post("/send-message", async (req, res) => {

    const { senderId, receiverId, message } = req.body
    const timestamp = new Date().toISOString()
    // console.log(timestamp)
    try {
        await client.connect()
        const db = client.db("flicker")
        const messages = db.collection("messages")
        const data = { from_userId: senderId, to_userId: receiverId, timestamp: timestamp, message: message }
        const response = await messages.insertOne(data)
        if (response) {
            res.status(200).json({ success: true })
        }
        else {
            res.json(300).json({ success: false })
        }
    }
    catch (error) {
        res.json(400).json({ success: false })
    }
})


//socket io chat
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Jab user chat open kare, use ek private room mein daal dein
    socket.on("join_chat", (data) => {
        const { senderId, receiverId } = data;
        // Room ID unique honi chahiye (dono users ke liye same)
        const roomId = [senderId, receiverId].sort().join("-");
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Message bhejne ka logic
    socket.on("send_message", async (data) => {
        const { senderId, receiverId, message } = data;
        const roomId = [senderId, receiverId].sort().join("-");
        const timestamp = new Date().toISOString();

        // Database mein save karein (aapka purana logic)
        try {
            const db = client.db("flicker");
            const messages = db.collection("messages");
            const newMessage = { from_userId: senderId, to_userId: receiverId, timestamp, message };
            await messages.insertOne(newMessage);

            // Room mein maujood dusre user ko real-time message bhejein
            io.to(roomId).emit("receive_message", newMessage);
        } catch (err) {
            console.error("Socket error saving message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});



httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

