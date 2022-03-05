const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes')
const messageRoute = require('./routes/messageRoutes');
const socket = require("socket.io");


const app = express();
require('dotenv').config();

app.use(cors())
app.use(express.json())

app.use("/api/auth" , userRoutes)
app.use("/api/messages", messageRoute)

mongoose.connect("mongodb+srv://sapfironDB:E03DnZOxKBGOcPUn@cluster0.bzuwe.mongodb.net/realChat",  {  
    useNewUrlParser: true, 
    useUnifiedTopology: true
    }, () => console.log("DB connected")
)


const server = app.listen( process.env.PORT, ()=> {
    console.log(`Server stated on PORT ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
        origin:"http://localhost:3000",
        credentials:true,
    }
});

global.onlineUser = new Map();

io.on("connection" , (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUser.set(userId, socket.id);
    });

    socket.on("send-msg" , (data) => {
        console.log(data);
        const sendUserSocket = onlineUser.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    })
})