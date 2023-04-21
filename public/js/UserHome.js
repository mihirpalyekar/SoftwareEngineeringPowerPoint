$(document).ready(() => {
  $.ajax({
    type: "GET",
    url: "/developer/loadHome",
    success: function (data) {
      console.log(data);
      data.forEach((element) => {
        if (element.developerId) {
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
                                    <span class="postText"> ${element?.description} </span>
                                </div>
                                 <div class="postBottom">
                                    <div class="postBottomLeft">
                                    <img
                                        class="likeIcon"
                                        src="http://localhost:3000/img/like.png"
                                        alt=""
                            
                                    />
                                    <button class="invoke-like" data-userId="${element?.developerId?._id}" onclick="likePost(event)" >
                                        <img
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
          $("#toAppend").prepend(`
              <div class="postWrapper">
                                <div class="postTop">
                                    <div class="postTopLeft">
                                        <div class="postChatUsername">
                                            <span class="postChatroom">
                                            ${element?.name}
                                            </span>
                                            <span class="postUsername">
                                                ${element?.managerId?.name}
                                            </span>
                                        </div>
                                    </div>
                                  
                                </div>
                                <div class="postCenter">
                                    <img class="postImg" src="http://localhost:3000/images/${element?.fileUpload?.filename}" alt="" />
                                    <span class="postText"> ${element?.description} </span>
                                </div>
                                 <div class="postBottom">
                                    <div class="postBottomLeft">
                                    <img
                                        class="likeIcon"
                                        src="http://localhost:3000/img/like.png"
                                        alt=""
                            
                                    />
                                    <img
                                        class="likeIcon"
                                        src="http://localhost:3000/img/heart.png"
                                        alt=""
                    
                                    />
                                    <button class="invoke-like" data-userId="${element?.developerId?._id}" onclick="likePost(event)">
                                    <img
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
        }
      });
    },
    error: function () {
      alert("Error while loading profile");
    },
  });

  $(".invoke-like").click((e) => {
    console.log("Button clicked 3",e);
  });
});

function likePost(e) {
    e.preventDefault();
    let userId = e.target.dataset.userid.split('/')[0];
    let postId = e.target.dataset.userid.split('/')[1];
    let isManager = e.target.dataset.userid.split('/')[2];
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
          window.location.href = data.redirect;
        },
        error: function () {
          alert("Error while login manager");
        },
      });
    
  }
  
  