import express from "express"

const app = express()
const PORT = 3000

app.use(express.json())



app.post("/",(req,res)=>{
    
    const email = req.body.email
    res.send("email"+ email)
} )


app.listen(PORT, function (){
    console.log("listening")
})