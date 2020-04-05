const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
var compression = require('compression')
const userRoute = require("./routes/user")
const authRoute  = require('./routes/auth')
const disconnectUser = require('./controllers/disconnectUser')

const app = express();
app.use(compression());

// to parse incomming request data
app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE')
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Autherization')
    next();
})

app.use("/auth",authRoute)
app.use("/",userRoute)


mongoose.connect('mongodb credentials',{ useNewUrlParser: true,useUnifiedTopology: true })
.then(result=>{
 const server = app.listen(8080)
 const io = require("./socket").init(server,{
    cookie: false
  })
 let id = 0;
 console.log("CONNECTION SUCCESSS")
 io.on('connection',(socket)=>{
    /**
     * track user id
     */
    socket.on('send-socket-id',data=>{
    id=data.id
    })
    /**
     * Track user disconnection
     */
    socket.on('disconnect',disSocket=>{
    disconnectUser.disconnect(id)
    console.log('Client disconnected',id)

    io.emit('user-disconnected',{data:id})
    })
    socket.on('logout',data=>{
        console.log("logout initialled")
        socket.disconnect()
    })

 })


}).catch(err=>{
    console.log("err",err)
})

