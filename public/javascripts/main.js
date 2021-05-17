function multipleFunc() {
    document.getElementById("mySelect").multiple = true;
 }
//  $('select[multiple]').multiselect({
//     columns: 4,
//     placeholder: 'Select options'
//   });

tinymce.init({
    selector: ".tiny",
    plugins: 'a11ychecker advcode casechange formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tinycomments tinymcespellchecker',
    toolbar: 'a11ycheck addcomment showcomments casechange checklist code formatpainter pageembed permanentpen table',
    toolbar_mode: 'floating',
    tinycomments_mode: 'embedded',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
 })
 
$(document).ready(function() {
    function wait(){

        $.noConflict();
        $('#table-list').dataTable();
      }
    setTimeout(wait,2000)
    // $('#table-list').DataTable();
    $('#commentSubmit').click(e => {
        e.preventDefault()
        console.log('clicked')
        let commentContent = $('#Comment').val()
        let postId = $('#input-comment').val()
        console.log(commentContent)
        console.log(postId)
        $.ajax({
            url: '/newfeed/postComment',
            type: 'POST',
            data: {
                postId: postId,
                comment: commentContent
            }
        })
        .done(data => {
            let htmlcomment = `
                <li class="list-group-item mt-3" id="${data._id}">
                    <h6 class="card-title" >${data.Owner}
                        <p class="card-text"><small class="text-muted">${data.createAt} </small></p>
                    </h6>
                    <h6 class="card-subtitle mb-2 text-muted"></h6>
                    <p class="card-text" >${data.content} </p>
                    <div class="card-footer text-muted" style="text-align: right;">
                        <button type="button" id="commentdelete" data-id="${data._id}" class="btn btn-danger btn-sm">Delete</button>
                    </div>
                </li>`
            $(`ul#${postId}ulul`).prepend(htmlcomment)
            
            console.log(data)
        })
        document.getElementById('Comment').value = ''
    })
    $('#updatePassword').click(e => {
        let btn = e.target
        let id = btn.dataset.id
        let password = document.getElementById('password').value
        let newpassword = document.getElementById('newpassword').value
        console.log(btn)
        $.ajax({
            url: '/newfeed/falcutyUpdate',
            type: 'POST',
            data: {
                password: password,
                newpassword: newpassword
            }
        })
        .then(data => console.log(data))
        .catch(e =>console.log(e))
    })
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
            url: '/newfeed/updateAccount',
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
            $('img#userImg').attr('src',avatar)
        })
        .catch(e => console.log(e))
    })
    $('#post-delete').click(e => {
        const btn = e.target
        
        const id = btn.dataset.id
        console.log('Clicked')
        $('#btn-delete-confirmed').attr('data-id', id)
    })
    $('#btn-delete-confirmed').click(e => {
        e.preventDefault()
        const btn = e.target
        console.log(btn)
        console.log(btn.dataset)
        console.log(btn.dataset.id)
        const id = btn.dataset.id
        //console.log(id)
        $.ajax({
            url: '/newfeed/delete/'+id,
            type: 'POST',
            data: {
                id: id
            }
        })
        .then(data => {
            console.log(data)
            $(`div#${id}`).remove()
        })
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
        $('#updateModal').fadeIn('slow')
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
            url: '/newfeed/commentdelete/'+id,
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
        e.preventDefault()
        const btn = e.target
        const id = btn.dataset.id
        console.log(id)

        updatecontent = tinymce.get("updatecontent").getContent({format: 'raw'});
        tinyMCE.get('updatecontent').setContent('');

        console.log(updatecontent)
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
        .then(data => {
            $(`p#${id}1311`).html(updatecontent)
            console.log(data)
        })
        .then(result => console.log(result))
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
    $('#postNewfeed').click(e => {
        // let content = $('#postcontent').val()
        var myContent = tinymce.get("postcontent").getContent({format: 'raw'});
        tinyMCE.get('postcontent').setContent('');
        console.log(myContent)
        // console.log(content)
        $.ajax({
            url: '/newfeed/create',
            type: 'POST',
            data: {
                postcontent: myContent
            }
        })
        .done(data => {
            //console.log(data)
            let html = `
            <div class="card mt-3 bg-light" id="${data._id}">
                  <!--Dropdown edit, delete-->
                  <div class="card-header">
                    <div class="dropdown float-right" data-display="static" >
                      <i class="fas fa-ellipsis-h" id="dropdownMenuLink" style="cursor: pointer;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>

                    
                      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                        <a class="dropdown-item" id="post-update" data-id="${data._id}" style="cursor: pointer;">Chỉnh sửa bài viết</a>
                        <a class="dropdown-item" id="post-delete" data-id="${data._id}" style="cursor: pointer;">Xóa bài viết</a>
                      </div>
                    </div>
                  </div>
                  <!-- MODAL DELETE -->
                  <div class="modal fade" id="confirm-delete-dialog" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="del_postLabel">Xóa bài viết</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          Bạn có chắc rằng muốn xóa bài viết này?
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                          <button type="button" data-id="???" id="btn-delete-confirmed"data-dismiss="modal" class="btn btn-primary">Xóa</button>
                        </div>
                      </div>
                    </div>
                  </div>
                <!--Dropdown edit, delete-->
                <!--Update Modal-->
                <div class="modal fade" id="modalUpdate" tabindex="-1" role="dialog" aria-labelledby="PostUpdateModal">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" style="text-align: center; font-weight: bold; font-size: 30px;">Tạo bài viết</h5>
                      </div>
                      <div class="modal-body">
                          <form>
                              <textarea  name="updatecontent" id="updatecontent" style="border-radius: initial;border: none;outline: none;" class="form-control input-lg p-text-area" rows="2" placeholder="Whats in your mind today?"></textarea>
                              <div class="modal-footer">
                                <button type="button" data-id="${data._id} " id="update-confirmed" class="btn btn-primary">Đăng bài viết</button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                              </div>
                          </form>
                      </div>
                      
                    </div>
                  </div>
                </div>
                <!--Update Modal-->
                    <div class="card-body">
                      <h6 class="card-title" ><a href="/newfeed/timeline/${data.Owner}">${data.Owner} </a>
                          <p class="card-text"><small class="text-muted">${data.createAt} </small></p>
                      </h6>
                      <input type="hidden" id="postId" value="${data._id}">
                      <h6 class="card-subtitle mb-2 text-muted"></h6>
                      <p class="card-text" id="dataContent" style="overflow-y: auto;"> </p>
                        <div class="bg-white p-2">
                            <div class="d-flex flex-row fs-12">
                                <div class="like p-2 cursor action-collapse" data-toggle="collapse" aria-expanded="true" aria-controls="collapse-1${data._id}" href="#collapse-1${data._id}"><i class="far fa-comment"></i><span class="ml-1"  style="cursor: pointer;">Bình luận</span></div>
                            </div>
                        </div>	
                        <div id="collapse-1${data._id}" class="bg-light p-2 collapse" data-parent="#myGroup">
                            <div class="d-flex flex-row align-items-start"><img class="rounded-circle" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsdD1rK4ZtCJVizS00LaWifgJnY-wzSVBoHw&usqp=CAU" width="40">
                                <input id="Comment" class="form-control ml-1 shadow-none "></input>
                                <input type="hidden" id="input-comment" value="${data._id}"  >
                            </div>
                            <div class="mt-2 text-right"><button class="btn btn-primary btn-sm shadow-none" id="commentSubmit" type="button">Gửi bình luận</button><button class="btn btn-outline-primary btn-sm ml-1 shadow-none" type="button">Hủy</button></div>
                            <br>
                            <ul id="${data._id}" class="fb-comments" style="width:100%;">
                            </ul>
                        </div>
                    </div>
                </div>`
                $(`div#postList`).prepend(html)
                $(`p#dataContent`).html(`${data.content}`)
        })
    })
  });
function deleteNotification() {
    let id = $('#Notif_id').val()
    $.ajax({
        url: '/newfeed/allNotif/'+id+'/delete',
        type: 'POST',
        data: {
            id: id
        }
    })
    .then(data => {
        console.log(data)
        window.location.href = '/newfeed/allNotif'
    })
    .catch(e => console.log(e))
}
function updateNotification() {
    let id = $('#Notif_id').val()
    let title = $('#NotifTitle').val()
    let content = $('#NotifContent').val()
    let falcuty = $('#Notiffalcuty').val()
    let current = new Date().getTime()
    console.log(falcuty)
    $.ajax({
        url: '/newfeed/allNotif/'+id+'/update',
        type: 'POST',
        data: {
            id: id,
            title: title,
            content: content,
            falcuty: falcuty
        }
    })
    .then(data => {
        console.log(data)
        $(`p#NotificationContent`).html(content)
        $(`p#NotifInfo`).html(`${falcuty}  |  ${current}`)
        $(`h1#NotifTitle`).html(title)
    })
    .catch(e => console.log(e))
}
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

    })
    }
// function postComment() {
//     var inputComment = document.getElementById('input-comment').value
//     var postId = document.getElementById("postId").value;
//     var comment = document.getElementById(inputComment).value
//     console.log(comment)
//     var ajax = new XMLHttpRequest();
//     ajax.open('POST', '/newfeed/postComment', true);
//     ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//     ajax.onreadystatechange = () => {
//         if(this.readyState == 4 && this.status == 200) {
//             var res = JSON.parse(this.responseText);

//             var html = `
//             <li class="list-group-item mt-3">
//             <h6 class="card-title" >${res.user.name}
//                 <p class="card-text"><small class="text-muted">3 tháng 5 lúc 20:00</small></p>
//             </h6>
//             <h6 class="card-subtitle mb-2 text-muted"></h6>
//             <p class="card-text" >${res.comment}</p>
//             <div class="card-footer text-muted" style="text-align: right;">
//                 <button class="btn btn-info btn-sm"><i class="far fa-edit"></i></button>
//                 <button class="btn btn-danger btn-sm"><i class="far fa-trash-alt"></i></button>
//             </div>
//         </li>
//         `
//         console.log(res)
//         document.getElementById(postId).innerHTML = html
//         }
//     }
    
//     ajax.send("comment=" + comment + "&postId=" + postId);
// }
var socket = io('https://unisocialmedia.herokuapp.com')
//------------------------------------------------------------------------------ĐOẠN NÀY CẦN COI LẠI À NHA-----------------------------------------------//
socket.on("messageSent", (message) => {
    $.notify(message.falcuty + " vừa đăng thông báo: "+ message.title)
    //$('#popupdiv').show()
})

function sendMessage() {
    console.log('Clicked')
    let falcuty = document.getElementById('falcuty').value
    let content = document.getElementById('NotifContent').value
    let title = document.getElementById('NotifTitle').value
    $.ajax({
        url: '/newfeed/createNotification',
        type: 'POST',
        data: {
            title: title,
            content: content,
            falcuty: falcuty
        }
    })
    .then(data => console.log(data))
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

