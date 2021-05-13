function multipleFunc() {
    document.getElementById("mySelect").multiple = true;
 }
//  $('select[multiple]').multiselect({
//     columns: 4,
//     placeholder: 'Select options'
//   });
$(document).ready(function() {
    $('#table-list').DataTable();
    $('#updateAccount').click(e => {
        const btn = e.target
        const id = btn.dataset.id
        console.log(btn.dataset)
        let name = document.getElementById('name').value
        let lop = document.getElementById('class').value
        let falcuty = document.getElementById('falcuty').value
        let avatar = document.getElementById('avatar').value
        console.log(name + lop + falcuty + avatar)
        $.ajax({
            url: 'http://localhost:8080/newfeed/updateAccount',
            type: 'POST',
            data: {
                id: id,
                name: name,
                class: lop,
                falcuty: falcuty,
                avatar: avatar
            }
        })
        .then(data => {
            $('a#navbarDropdownMenuLink').html(`<img class="rounded mr-3" src="${avatar}" width="40">${name}`)
        })
        .catch(e => console.log(e))
    })
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
        console.log(btn)
        console.log(btn.dataset)
        console.log(btn.dataset.id)
        const id = btn.dataset.id
        $.ajax({
            url: 'http://localhost:8080/newfeed/delete/'+id,
            type: 'POST',
            data: {
                id: id
            }
        })
        .then(data => console.log(data))
        .catch(e => console.log(e))
        // fetch('http://localhost:8080/newfeed/delete/'+id, {
        //     method: 'POST'
        // })
        // .then(res => res.json())
        // .then(json => console.log(json))
        // .catch(e => console.log(e))
    })
    $('#post-update').click(e => {
        const btn = e.target
        const id = btn.dataset.id
        $('#update-confirmed').attr('data-id', id)
        $('#modalUpdate').modal('show')
    })
    $('#commentdelete').click(e => {
        e.preventDefault()
        const btn = e.target
        console.log(btn)
        console.log(btn.dataset)
        console.log(btn.dataset.id)
        const id = btn.dataset.id
        //console.log(id)
        $.ajax({
            url: 'http://localhost:8080/newfeed/commentdelete/'+id,
            type: 'POST',
            data: {
                id: id
            }
        })
        .then(data => {
            console.log(data)
            $(`li#${id}`).remove()
        })
        .catch(e => console.log(e))
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
        //$('#khoa').modal('hide')
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
            //console.log(data)
        })
    })
    $('#motcaiginonhamlon').click(e => {
        const btn = e.target
        const id = btn.dataset.id
        console.log(btn.dataset)
        console.log('Clicked')
        $.ajax({
            url: 'http://localhost:8080/newfeed/allNotif/'+id+'/delete',
            type: 'POST',
            data: {
                id: id
            }
        })
        .then(data => {
            console.log(data)
            window.location.href = 'http://localhost:8080/newfeed/allNotif'
        })
        .catch(e => console.log(e))
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
//------------------------------------------------------------------------------ĐOẠN NÀY CẦN COI LẠI À NHA-----------------------------------------------//
socket.on("messageSent", (message) => {
    $.notify(message.falcuty + "Vừa đăng thông báo: "+ message.content)
    //popup(message.falcuty,message.title)
})

function sendMessage() {
    console.log('Clicked')
    let falcuty = document.getElementById('falcuty').value
    let content = document.getElementById('NotifContent').value
    let title = document.getElementById('NotifTitle').value
    socket.emit("messageSent", {
        title : title,
        content : content,
        falcuty : falcuty
    })
    // popup(falcuty,title)
}
// function popup(falcuty,title){
//     document.getElementById('popup').innerHTML = ''
//     document.getElementById('popup').innerHTML =`

//     <button type="button" class="close" data-dismiss="alert">&times;</button>
//     ${falcuty} vừa đăng thông báo <a href="#" class="alert-link">${title}</h1></a>
//     `
//     document.getElementById('popupdiv').style.display = "block"
//     console.log('showed')
// }