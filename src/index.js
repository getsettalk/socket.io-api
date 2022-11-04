const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(server,{
  cors:{
      origin:'*',
      methods:['GET','POST']
  }
});
app.use(cors());



app.use(express.static('public'))
app.get('/',(req,res)=>{
    // res.sendFile(__dirname+'/index.html');
    res.send("Server is running")

})
var totalUser = 0;
var userLIST = {};
io.on('connection', (socket) => {
    console.log('Coming room id ',socket.id);
    var roomid = socket.id;
    totalUser = totalUser+1;
    io.emit('status', totalUser);
    console.log('a user connected', totalUser);
    
    // join particular roojm 
    socket.join(roomid)
    userLIST = {...userLIST,roomid}
    io.to(roomid).emit('joinRoom',({YoUroomid:roomid,uList:userLIST})) 
     console.log(userLIST)
    socket.on('disconnect', (sid) => {
      console.log(sid)
      console.log('user disconnected', totalUser);
      totalUser = totalUser-1;
      io.emit('status', totalUser);
      socket.broadcast.emit('Discuser', 'A new user has been disconnected ?');
    });
  });
 

server.listen(PORT,()=> console.log(` Listining at Port ${PORT}`))