function multipleFunc() {
    document.getElementById("mySelect").multiple = true;
 }
//  $('select[multiple]').multiselect({
//     columns: 4,
//     placeholder: 'Select options'
//   });
$(document).ready(function() {
    $('#post-delete').click(e => {
        const btn = e.target
        const id = btn.dataset.id
        //console.log('Clicked')
        $('#btn-delete-confirmed').attr('data-id', id)
        $('#confirm-delete-dialog').modal('show')
    })
    $('#btn-delete-confirmed').click(e => {
        $('#confirm-delete-dialog').modal('hide')
        const btn = e.target
        const id = btn.dataset.id

        fetch('http://localhost:8080/newfeed/delete/'+id, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(e => console.log(e))
    })
    $('#post-update').click(e => {
        const btn = e.target
        const id = btn.dataset.id
        $('#update-confirmed').attr('data-id', id)
        $('#modalUpdate').modal('show')
    })
    $('#update-confirmed').click(e => {
        $('#modalUpdate').modal('hide')
        const btn = e.target
        const id = btn.dataset.id
        updatecontent = document.getElementById('updatecontent').value
        //console.log(updatecontent)
        //console.log('OK')
        $.ajax({
            url: '/newfeed/update/'+id,
            type: 'POST',
            data: {
                id: id,
                updatecontent: updatecontent
            }
        })
        .done(data => {
            //console.log(data)
        })
        .catch(e => console.log(e))
    })
    $('#sendNotif').click(e => {
        let title = document.getElementById('NotifTitle').value
        let content = document.getElementById('NotifContent').value
        let falcuty = document.getElementById('falcuty').value
        $('#khoa').modal('hide')
        $.ajax({
            url: '/newfeed/createNotification',
            type: 'POST',
            data: {
                title: title,
                content: content,
                falcuty: falcuty
            }
        })
        .done(data => {
            console.log(data)
        })
    })
  });
function postNewfeed() {
    var content = document.getElementById('postcontent').value
    //console.log(content)
    $.ajax({
        url: '/newfeed/create',
        type: 'POST',
        data: {
            postcontent: content
        }
    })
    .done(data => {
        //console.log(data)
        $('#myModal').hide()
    })
    }
function postComment() {
    var inputComment = document.getElementById('input-comment').value
    var postId = document.getElementById("postId").value;
    var comment = document.getElementById(inputComment).value
    console.log(comment)
    var ajax = new XMLHttpRequest();
    ajax.open('POST', '/newfeed/postComment', true);
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    ajax.onreadystatechange = () => {
        if(this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);

            var html = `
            <li class="list-group-item mt-3">
            <h6 class="card-title" >${res.user.name}
                <p class="card-text"><small class="text-muted">3 tháng 5 lúc 20:00</small></p>
            </h6>
            <h6 class="card-subtitle mb-2 text-muted"></h6>
            <p class="card-text" >${res.comment}</p>
            <div class="card-footer text-muted" style="text-align: right;">
                <button class="btn btn-info btn-sm"><i class="far fa-edit"></i></button>
                <button class="btn btn-danger btn-sm"><i class="far fa-trash-alt"></i></button>
            </div>
        </li>
        `
        console.log(res)
        document.getElementById(postId).innerHTML = html
        }
    }
    
    ajax.send("comment=" + comment + "&postId=" + postId);
}
var socket = io('http://localhost:8080')

socket.on("messageSent", (message) => {
    $.notify(message.falcuty + "Vừa đăng thông báo: "+ message.content)
})

function sendMessage() {
    console.log('Clicked')
    socket.emit("messageSent", {
        title : document.getElementById('NotifTitle').value,
        content : document.getElementById('NotifContent').value,
        falcuty : document.getElementById('falcuty').value
    })
}