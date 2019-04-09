var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var axios = require('axios')

app.use(express.static("./"))

server.listen(3000, () => {
    console.log("Start PORT*3000")
});
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// emit: gui su kien
// on: lang nghe su kien
// io => server (socket, socket socket socket)
// socket => client
var arrayUser = []

io.on('connection', function (socket) {
  console.log("Da co user connect", socket.id)

  console.log(arrayUser)

  let serverSendArrayUser = () => io.emit('notify_user_online', arrayUser)

  serverSendArrayUser()

  socket.on("disconnect", function () {
    let pos = arrayUser.findIndex(function(element) {
        return socket.id === element
    })

    arrayUser.splice(pos, 1)

    serverSendArrayUser()
    console.log("User dissconnect:", socket.id)
  })

  socket.on('Client_send_username_to_Server', data => {
      socket.name = data
      arrayUser.push(socket.name)
      serverSendArrayUser()
      let account = { id:socket.id, name: socket.name }
      socket.emit('Server_send_account_to_client', account)
  })

  socket.on('Client_send_accout_to_server', data => {
    socket.id = data.id
    socket.name = data.name
    arrayUser.push(socket.name)
    serverSendArrayUser()
  })

  socket.on('Client_send_message_to_server', data => {
    axios('http://sandbox.api.simsimi.com/request.p?key=b923f855-5e6f-411c-a868-ac3adcbf7098&lc=en&ft=1.0&text='+data.content)
      .then(response => {
        socket.broadcast.emit("Server_send_message_to_client", {
          id: 'simi-bot',
          name: 'SIMI BOT',
          content: response.data.response
        })
      })
      .catch(response => response)
      
    socket.broadcast.emit("Server_send_message_to_client", data)
  })
});