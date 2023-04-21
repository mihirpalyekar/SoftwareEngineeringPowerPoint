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
                                    <div class="postBottom">
                                    <div class="postBottomLeft">

                                    <button class="invoke-like" data-userId="${element.developerId._id}" data-postId="${element?._id}" data-isManager="0" onclick="likePost(event)" >
                                    <img
                                    data-userId="${element.developerId._id}" data-postId="${element?._id}" data-isManager="0" 
                                    class="likeIcon"
                                    src="http://localhost:3000/img/${element.likedBy.indexOf(element.developerId._id) >= 0 ? 'heart.png ' : 'like.png' } "
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
                                    <button class="invoke-like" data-userId="${element.managerId._id}" data-postId="${element?._id}" data-isManager="1" onclick="likePost(event)">
                                    <img
                                    data-userId="${element.managerId._id}" data-postId="${element?._id}" data-isManager="1"
                                    class="likeIcon"
                                    src="http://localhost:3000/img/${element.likedBy.indexOf(element.managerId._id) >= 0 ? 'heart.png ' : 'like.png' } "
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
                src="http://localhost:3000/img/like.png"
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
  