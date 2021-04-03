const express = require('express')
const app = require('express')()
const port = process.env.PORT || 3000
const http = require('http').Server(app)
const socketio = require('socket.io')(http)

app.use(express.static(__dirname + '/dist'))
app.get(/.*/, (req, res) => {
	res.sendFile(__dirname + '/dist/index.html')
})

http.listen(port, () => {
	console.log(`Listening on port ${port}`)
})


clients=[]

socketio.on("connection", socket=>{
    console.log("Biri bağlandı."+socket.id);
    function RandomSayiUret(min,max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function random_rgba() {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s)+')';
    }

    let position={
        x:RandomSayiUret(0,600),
        y:RandomSayiUret(0,600),
        gen:25,
    };
    let data={
        id:socket.id,
        x:position.x,
        y:position.y,
        h:position.gen,
        w:position.gen,
    };
    
  
    clients.push(data);
    socketio.emit("sockets",clients);

    socket.on("position",data=>{
      
                clients[data[3]].x=data[0];
                clients[data[3]].y=data[1];
                 socketio.emit("sockets",clients);

          
    })
    


    socket.on("disconnecting",()=>{
        console.log("Kullanıcı çıktı", socket.id);
       for(var i = 0; i<clients.length; i++){
        if (socket.id == clients[i].id){
            clients.splice(i, 1);
        }
       }
         socketio.emit("sockets",clients);
    })
    
});
