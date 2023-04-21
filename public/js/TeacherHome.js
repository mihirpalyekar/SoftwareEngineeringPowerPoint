$(document).ready(() => {
  $("#creatClass").click((e) => {
    e.preventDefault();

    var data = {};

    $("#topClassCreate")
      .serializeArray()
      .forEach((element) => {
        if (element.value) {
          data[element.name] = element.value;
        }
      });
    console.log(data);
    $.ajax({
      type: "POST",
      url: "/chatRoom/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      dataType: "json",
      success: function (data) {
        alert("Chat room created Succesfully");
      },
      error: function (e) {
        alert("Chat room name already taken");
        console.log(e);
      },
    });
  });

  $.ajax({
    type: "GET",
    url: "/manager/loadHome",
    success: function (data) {
      data.forEach((element) => {
        if (element.developerId) {
          let userId = element.developerId._id?.toString() + '/' + element?._id+'0';
          $("#toAppend").prepend(`
            <div class="postWrapper">
                                <div class="postTop">
                                    <div class="postTopLeft">
                                        <div class="postChatUsername">
                                            <span class="postChatroom">
                                            ${element?.name}
                                            </span>
                                            <span class="postUsername">
                                                ${element?.developerId?.name}
                                            </span>
                                        </div>
                                    </div>
                                  
                                </div>
                                <div class="postCenter">
                                    <img class="postImg" src="http://localhost:3000/images/${element?.fileUpload?.filename}" alt="" />
                                    <span class="postText"> This is the description of a post dasifggfasdkjgfhaskjfha lkajsdhflkjhafg jhasdlkjfhaslkj </span>
                                </div>
                                 <div class="postBottom">
                                    <div class="postBottomLeft">
                                    <img
                                        class="likeIcon"
                                        src="http://localhost:3000/img/like.png"
                                        alt=""
                            
                                    />
                                    <button class="invoke-like" data-userId="${element.developerId._id}" data-postId="${element?._id}" data-isManager="0" onclick="likePost(event)" >
                                    <img
                                    data-userId="${element.developerId._id}" data-postId="${element?._id}" data-isManager="0" 
                                        class="likeIcon invoke-like"
                                        src="http://localhost:3000/img/heart.png"
                                        alt=""
                    
                                    />
                                </button>
                                    <span class="postLikeCounter">2 people like this</span>
                                    </div>
                                    <div class="postBottomRight">
                                        <span class="postCommentText">9 comments</span>
                                    </div>
                                </div>`);
        } else {
          let userId = element.managerId._id?.toString() + '/' + element?._id+'1';
          $("#toAppend").prepend(`
           <div class="postWrapper">
                                <div class="postTop">
                                    <div class="postTopLeft">
                                        <div class="postChatUsername">
                                            <span class="postChatroom">
                                            ${element?.name}
                                            </span>
                                            <span class="postUsername">
                                                ${element?.managerId.name}
                                            </span>
                                        </div>
                                    </div>
                                  
                                </div>
                                <div class="postCenter">
                                    <img class="postImg" src="http://localhost:3000/images/${element?.fileUpload?.filename}" alt="" />
                                    <span class="postText"> This is the description of a post dasifggfasdkjgfhaskjfha lkajsdhflkjhafg jhasdlkjfhaslkj </span>
                                </div>
                                 <div class="postBottom">
                                    <div class="postBottomLeft">
                                    <img
                                        class="likeIcon"
                                        src="http://localhost:3000/img/like.png"
                                        alt=""
                            
                                    />
                                    <button class="invoke-like" data-userId="${element.managerId._id}" data-postId="${element?._id}" data-isManager="1" onclick="likePost(event)">
                                    <img
                                    data-userId="${element.managerId._id}" data-postId="${element?._id}" data-isManager="1"
                                        class="likeIcon invoke-like"
                                        src="http://localhost:3000/img/heart.png"
                                        alt=""
                    
                                    />
                                </button>
                                    <span class="postLikeCounter"></span>
                                    </div>
                                    <div class="postBottomRight">
                                        <span class="postCommentText">9 comments</span>
                                    </div>
                                </div>`);
        }
      });
    },
    error: function () {
      alert("Error while loading profile");
    },
  });

  $(".invoke-like").click(() => {
    console.log("Button clicked 1");
  });
});


function likePost(e) {
  e.preventDefault();
  let userId = e.target.dataset.userid;
  let postId = e.target.dataset.postid;
  let isManager = e.target.dataset.ismanager;
  let url = isManager == '0' ? '/developer/post/likeDocument' : '/manager/post/likeDocument'
  var data = {
      UserId: userId,
      postId: postId
  };

    $.ajax({
      type: "POST",
      url:url,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      dataType: "json",
      success: function (data) {
        // window.location.href = data.redirect;
        console.log(data);
        if(!data.like) {
          // add image for non liked image
          document.querySelectorAll(`[data-postId="${postId}"]`)[0].innerHTML = '';
          document.querySelectorAll(`[data-postId="${postId}"]`)[0].innerHTML = (`
            <img
            data-userId="${userId}" data-postId="${postId}" data-isManager="${isManager}"
                class="likeIcon invoke-like"
                src="http://localhost:3000/img/heart.png"
                alt=""

            />`)
        } else {
           // add image for liked image
          document.querySelectorAll(`[data-postId="${data.like.postId}"]`)[0].innerHTML = '';
          document.querySelectorAll(`[data-postId="${data.like.postId}"]`)[0].innerHTML = (`
            <img
            data-userId="${data?.like?.UserId}" data-postId="${data?.like?.postId}" data-isManager="${isManager}"
                class="likeIcon invoke-like new"
                src="http://localhost:3000/img/heart.png"
                alt=""

            />
            `)
        }
        
      },
      error: function (e) {
        console.log(e)
        alert("Error while login manager",e);
      },
    });
  
}

