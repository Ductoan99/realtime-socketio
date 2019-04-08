$(document).ready(function () {
    var socket = io.connect('http://localhost:3000');
    
    $(".main").hide()

    $("#form-username").keyup(function(event){
        if(event.keyCode === 13) {
           let name = $(this).val()
           socket.emit('Client_send_username_to_Server', name)
           
           $(".login").hide()
           $(".main").show()
        }
    })

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

})