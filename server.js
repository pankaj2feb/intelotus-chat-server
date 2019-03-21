var express = require('express');
var socket = require('socket.io');
const basicAuth = require('express-basic-auth')
var app = express();

server = app.listen(4000, function(){
    console.log('server is running on port 4000')
});

/******SERVER SETTING CORS */
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, authorization"
	);
    next();
    
});
/******SERVER SETTING CORS */

/*******HTTP BASIC AUTH */
app.get('/login', basicAuth({
    users: { 'admin': 'admin' }
}), function (req, res) {
    res.send('loggedin');
});
/*******HTTP BASIC AUTH */



/*******SERVER ERROR HANDLER */
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: err
//     });
//   });

/*******SERVER ERROR HANDLER */

/************  WEB SOCKET ****/
io = socket(server);

app.locals.agentId = null;



io.on('connection', (socket) => {
    //console.log(socket.id);
    console.log("in");
        let self = this;
        


    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
    })

    console.log(Object.keys(io.sockets.connected));
    console.log(io.engine.clientsCount);

    let clients = Object.keys(io.sockets.connected);

    io.emit('CONNECTED_CLIENTS', clients);

    socket.on('PRIVATE_MESSAGE_SEND', function(data){
        const clientId = data.privateId;
        socket.to(clientId).emit('RECEIVE_MESSAGE', data);
    })
    
    socket.on('SERVER_ID', function(data){
        io.emit('SERVER_ID_RECEIVE', data);
        app.locals.agentId = data.serverid;
        //agentId = data.serverid;
        console.log('SERVER_ID', app.locals.agentId);
        
    })


    socket.on('HELLO_SERVER', function(data){
        let clientId = data.privateId;
        let chatAgentId = app.locals.agentId;
        console.log('HELLO_CLIENT_AGENT', app.locals.agentId)
        console.log('HELLO_CLIENT_ID', clientId)
        socket.emit('HELLO_CLIENT', {serverid:app.locals.agentId});
        socket.to(chatAgentId).emit('CLIENT_DETAILS', {clientId, username:data.username});
    })

});





/************  WEB SOCKET ****/