$(document).ready(function () {
    var socket = io.connect('http://localhost:3000');
    let __account = JSON.parse(localStorage.getItem('__account'))

    $(".main").hide()

    $("textarea").keyup( function(event) {
        if(event.keyCode === 13) {
          let message = {
              id: socket.id,
              name: socket.name,
              content: $(this).val().trim()
          }
          socket.emit('Client_send_message_to_server', message)
          $(this).val('')
        }
    })

    $("button").click(function() {
        let message = {
            id: socket.id,
            name: socket.name,
            content: $("textarea").val().trim()
        }
        socket.emit('Client_send_message_to_server', message)
        $("textarea").val('')
    })
    
    $("#form-username").keyup(function(event){
        if(event.keyCode === 13) {
           let name = $(this).val()
           socket.emit('Client_send_username_to_Server', name)
           socket.name = name
           $(".login").hide()
           $(".main").show()
        }
    })


    if(__account) {
        socket.emit('Client_send_accout_to_server', __account)
        $(".login").hide()
        $(".main").show()
        socket.name = __account.name
        socket.id = __account.id
    }

    let renderListUser = (array) => {
        return  array.reduce((acc, cur) => {
            acc +=`<div>${cur}</div>`
            return acc
        }, '')
    }

    socket.on('notify_user_online', arrayUser => {
        console.log("Server emit to client", arrayUser)
        $(".list-user").html(renderListUser(arrayUser))
        $(".main-left__top").html(`<div>${arrayUser.length} users online</div>`)
    })

    socket.on('Server_send_account_to_client', account => {
        localStorage.setItem('__account', JSON.stringify(account))
    })

    socket.on('Server_send_message_to_client', data => {
        if(data.id !== socket.id) {
            let message = `<div class="flexbox">
                    <div class="message">
                        <div class="message-name">${data.name}</div>
                        <div class="message-content">${data.content}</div>
                    </div>
                </div>`
            $(".form-content").append(message)
        } else {
            let message = `<div class="flexbox-reverse">
                    <div class="message-rep">
                        <div class="message-name">${data.name}</div>
                        <div class="message-content">${data.content}</div>
                    </div>
            </div>`
            $(".form-content").append(message)
        }
        $(".form-content").scrollTop($(".form-content")[0].scrollHeight)
    })
})