const express=require('express');
const socketio=require('socket.io');

const PORT=process.env.PORT || 8080;
const router=require('./router');

const app=express();

const {addUser,removeUser,getUser,getUserInRoom}=require('./user');

app.use(router);

const server=app.listen(PORT,()=>{
    console.log('Connected');
});
const io=socketio(server);


io.on('connection',(socket)=>{
    console.log('New connection found');
    
    socket.on('join',({name,room},callback)=>{
    const {error,user}=addUser({id:socket.id,name,room});
    if(error)
      {
        return callback({error});
      }
     socket.emit('message',{user:'admin',text:`${name},Welcomes to the Room :${room}`});
     socket.broadcast.to(room).emit('message',{user:'admin',text:`${user.name} has joined the room`});
     socket.join(user.room);
     callback();
    });

    socket.on('sendMessage',(messsage,callback)=>{
      const user=getUser(socket.id);
      io.to(user.room).emit('message',{user:user.name,text:messsage});

      io.to(user.room).emit('roomData',{room:user.room,users:getUserInRoom(user.room)});
      callback();
    });

    socket.on('disconnect',()=>{
        console.log('User has left');
        const user=removeUser(socket.id);
        if(user)
        {
          io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left the room`});
        }
    })

})



