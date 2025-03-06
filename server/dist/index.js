"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
require("dotenv/config");
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const URI = process.env.URI;
const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;
const JWT_SECRET = process.env.JWT_SECRET;
const client = new mongodb_1.MongoClient(URI);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('heyllo world');
    res.status(200).send('heloo');
}));
// SIGNUP //
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //taking the email and password - 
    const email = req.body.email;
    const password = req.body.password;
    const userId = (0, uuid_1.v4)();
    //hashed password - 
    const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
    try {
        yield client.connect();
        const database = client.db("flicker");
        const users = database.collection("users");
        // CHECKING IF  EMAIL EXIST
        const existingUser = yield users.findOne({ email });
        if (existingUser) {
            res.status(409).send({ message: "email already exist" });
            return;
        }
        // INSERTING THE USER INFO
        const response = yield users.insertOne({
            userId,
            email,
            password: hashedPassword
        });
        // console.log(response)
        const token = jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, { expiresIn: "1D" });
        res.status(200).json({ "success": true, message: "Signed in successfully!", email, token, userId });
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(500).json({ message: "json webtoken error couldn't generate webtoken" });
        }
        console.log(err);
        res.status(505).json({ "success": false });
    }
    finally {
        // await client.close()
    }
}));
// LOGIN //
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //1.take the input
    const email = req.body.email;
    const password = req.body.password;
    try {
        yield client.connect();
        const db = client.db("flicker");
        const user = db.collection("users");
        const findUser = yield user.findOne({ email });
        console.log(findUser);
        if (!findUser) {
            res.status(400).json({ message: "email not found" });
            console.log("email not found");
        }
        const checkPassword = yield bcrypt_1.default.compare(password, findUser === null || findUser === void 0 ? void 0 : findUser.password);
        if (!checkPassword) {
            res.status(401).json({ message: "Incorrect Password" });
            console.log("password incorrect");
        }
        // console.log(checkPassword)
        // GENERATING TOKEN //
        if (findUser && checkPassword) {
            const token = jsonwebtoken_1.default.sign({ id: findUser.userId }, JWT_SECRET, { expiresIn: "1d" });
            // console.log(token)
            // SENDING SUCCESS MESSAGE //
            res.status(200).json({ success: true, message: "Logged in successfully!", userId: findUser.userId, token });
            console.log("log in successful and response is sent");
        }
    }
    catch (err) {
        if (err instanceof Error) {
            //CATCHING JWT ERROR
            if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                res.status(401).json("invalid token");
                console.log("this is invalid token found in the server");
            }
            //CATCHING MONGO NETWORK ERROR
            if (err.name == "MongoNetworkError") {
                res.status(500).json({ message: "Database connection error. Please try again later." });
            }
        }
    }
}));
// UPDATE USER INFO (/ONBOARDING) //
app.put("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //GET THE INFO FROM USER
    const formData = req.body.formData;
    // console.log("formData")
    // console.log(formData)
    const capitalName = formData.full_name.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    //INSERT IN THE DATABASE
    try {
        yield client.connect();
        const db = client.db("flicker");
        const users = db.collection("users");
        const query = { userId: formData.userId };
        const updateDocument = {
            $set: { full_name: capitalName,
                dob_date: formData.dob_date,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                gender: formData.gender,
                show_gender: formData.show_gender,
                interest_gender: formData.interest_gender,
                about_me: formData.about_me,
                profile: formData.profile,
                matches: formData.matches }
        };
        const updateUser = yield users.updateOne(query, updateDocument);
        if (updateUser) {
            res.status(200).json(updateUser);
            // console.log("---------------update user:--------------- ")
            // console.log(updateUser)
        }
    }
    catch (err) {
        console.log("//-------CAUGHT AN ERROR-------//");
        console.log(err);
    }
}));
// GET USER INFO (/DASHBOARD) // 
app.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    try {
        yield client.connect();
        const db = client.db("flicker");
        const user = db.collection("users");
        const query = { userId };
        const findUser = yield user.findOne(query);
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
            });
        }
        // console.log(findUser)
    }
    catch (err) {
        res.status(400).json({ err });
        console.log(err);
    }
}));
// GET INTERST GENDER FOR MATCHES (/DASHBOARD)//
app.get("/interest-gender", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gender = req.query.interest_gender;
    const interest_gender = req.query.gender;
    try {
        yield client.connect();
        const db = client.db("flicker");
        const userCollection = db.collection("users");
        const queryDocument = {
            $and: [
                { gender: gender },
                { interest_gender: interest_gender }
            ]
        };
        const foundUsers = yield userCollection.find(queryDocument).toArray();
        if (foundUsers) {
            const sendResponse = foundUsers.map((user) => {
                return {
                    userId: user.userId, about_me: user.about_me, dob_date: user.dob_date, dob_month: user.dob_month, dob_year: user.dob_year,
                    email: user.email, full_name: user.full_name, gender: user.gender, interest_gender: user.interest_gender, show_gender: user.show_gender,
                    profile: user.profile
                };
            });
            // console.log("---found user---")
            // console.log(sendResponse)
            res.status(200).json(sendResponse);
        }
        else
            res.status(400);
    }
    catch (error) {
        console.log("---------caught an error in console---------");
        console.log(error);
    }
}));
//UPDATE THE LIKED-PROFILES ARRAY FOR USER
app.put("/liked-profiles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, matchId } = req.body;
    //step 1 update the liked_profiles
    //step 2 check if the same user likes you
    //step 3 then update the match array
    try {
        yield client.connect();
        const db = client.db("flicker");
        const userCollection = db.collection("users");
        //Update the liked_profiles for user
        const query = { userId: userId };
        const updateDocument = {
            $push: { liked_profiles: { userId: matchId } }
        };
        const response = yield userCollection.updateOne(query, updateDocument);
        if (response) {
            res.status(200).json({ success: true });
        }
        //checking if the same user likes you 
    }
    catch (error) {
        res.status(500);
        console.log(error);
    }
}));
// UPDATE THE MATCH FOR THE USER
app.put("/update-matches", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.matchId;
    const matchId = req.body.userId;
    try {
        yield client.connect();
        //check if user like matchid user then add eachothers userid to matches array
        const db = client.db("flicker");
        const users = db.collection("users");
        const query = { userId: userId, liked_profiles: { $elemMatch: { userId: matchId } } };
        const response = yield users.findOne(query);
        // console.log("update-match ongoing .....")
        // console.log(response)
        if (response) {
            // console.log("users are matches now matching them.........")
            let queryDocument = {
                $push: { matches: { userId: matchId } }
            };
            const response1 = yield users.updateOne({ userId: userId }, queryDocument);
            queryDocument = {
                $push: { matches: { userId: userId } }
            };
            const response2 = yield users.updateOne({ userId: matchId }, queryDocument);
            res.status(200).json({ success: true, response1, response2 });
        }
    }
    catch (err) {
        console.log(err);
    }
}));
//GET INFO OF MATCHES FOR THE MATCH DISPLAY
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.query.MatchesIds === "string") {
        const MatchesIds = JSON.parse(req.query.MatchesIds);
        try {
            // console.log(MatchesIds)
            yield client.connect();
            const db = client.db("flicker");
            const userCollection = db.collection("users");
            const pipeline = [
                {
                    '$match': {
                        'userId': {
                            '$in': MatchesIds
                        }
                    }
                }
            ];
            const matchesArray = yield userCollection.aggregate(pipeline).toArray();
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
                };
            });
            // console.log("------------------ Matches Array ------------------")
            // console.log(sendResponse)
            res.json(sendResponse).status(200);
        }
        catch (error) {
            // console.log("------------------ error occured ------------------")
            res.status(400);
            console.log(error);
        }
    }
}));
// GET INFO OF MATCH USER FOR CHATHEADER
app.get("/match-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    try {
        yield client.connect();
        const db = client.db("flicker");
        const users = db.collection("users");
        const query = { userId: userId };
        const response = yield users.findOne(query);
        if (response == null)
            console.log("couldn't find user");
        const sendResponse = { profile: response === null || response === void 0 ? void 0 : response.profile, name: response === null || response === void 0 ? void 0 : response.full_name };
        res.status(200).json(sendResponse);
    }
    catch (error) {
        console.log("error occured in match-user");
        console.log(error);
    }
}));
// GET USER MESSAGES
app.get("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = req.query.senderId;
    const receiverId = req.query.receiverId;
    // console.log(senderId)
    // console.log(receiverId)
    try {
        yield client.connect();
        const db = client.db("flicker");
        const users = db.collection("messages");
        const query = { from_userId: senderId, to_userId: receiverId };
        const response = yield users.find(query).toArray();
        const sendResponse = response.map((user) => {
            let full_time = new Date(user.timestamp);
            return { from_userId: user.from_userId,
                timestamp: user.timestamp,
                message: user.message };
        });
        if (response) {
            res.status(200).json(sendResponse);
        }
        else {
            //NO MESSAGES FROM SENDER SIDE TO RECEIVER
            res.status(200);
        }
    }
    catch (error) {
        res.status(404).json(error);
    }
}));
//POST USER MESSAGE
app.post("/send-message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId, message } = req.body;
    const timestamp = new Date().toISOString();
    // console.log(timestamp)
    try {
        yield client.connect();
        const db = client.db("flicker");
        const messages = db.collection("messages");
        const data = { from_userId: senderId, to_userId: receiverId, timestamp: timestamp, message: message };
        const response = yield messages.insertOne(data);
        if (response) {
            res.status(200).json({ success: true });
        }
        else {
            res.json(300).json({ success: false });
        }
    }
    catch (error) {
        res.json(400).json({ success: false });
    }
}));
app.listen(PORT, function () {
    console.log("listening");
});
