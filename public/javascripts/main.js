$('select[multiple]').multiselect({
    columns: 4,
    placeholder: 'Select options'
  });
function postComment() {
    var inputComment = document.getElementById('input-comment').value
    var postId = document.getElementById("postId").value;

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
        document.getElementById(postId).innerHTML = html
        }
    }
    
    ajax.send("comment=" + inputComment + "&postId=" + postId);
}