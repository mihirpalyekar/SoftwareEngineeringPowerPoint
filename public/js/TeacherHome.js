var currentUser = $(".headerDiv").data("username");
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
        clearInput();
      },
      error: function (e) {
        alert("Chat room name already taken");
        clearInput();
        console.log(e);
      },
    });
  });

  $.ajax({
    type: "GET",
    url: "/manager/loadHome",
    success: function (data) {
      data.forEach((element) => {
        console.log(element);
        if (element.developerId) {
          let userId =
            element.developerId._id?.toString() + "/" + element?._id + "0";
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
                                        <span class="postDate">${new Date(
                                          element.createdAt
                                        ).toLocaleDateString()}</span>
                                    </div>
                                  
                                </div>
                                <div class="postCenter">
                                    <img class="postImg" src="http://localhost:3000/images/${
                                      element?.fileUpload?.filename
                                    }" alt="" />
                                    <span class="postText"> ${
                                      element?.description
                                    } </span>
                                </div>
                                 <div class="postBottom">
                                    <div class="postBottomLeft">

                                    <button class="invoke-like" data-userId="${
                                      element.developerId._id
                                    }" data-postId="${
            element?._id
          }" data-isManager="0" 
                                    onclick="likePost(event)" >
                                    <img
                                    data-userId="${
                                      element.developerId._id
                                    }" data-postId="${
            element?._id
          }" data-isManager="0" 
                                    class="likeIcon"
                                    src="http://localhost:3000/img/${
                                      element.likedBy.indexOf(
                                        element.developerId._id
                                      ) >= 0
                                        ? "heart.png "
                                        : "heartless.png"
                                    } "
                                    alt=""
                                    />
                                </button>
                                    <span class="postLikeCounter">${
                                      element.likeCount
                                    }  people like this</span>
                                    </div>
                                    <div class="postBottomRight" data-toggle="modal" data-target="#commentModal">
                                    <span class="postCommentText" data-userId="${
                                      element.developerId._id
                                    }" data-postId="${element?._id}" 
          data-isManager="0" 
          data-username=${element.developerId.name}>
                                    Comments</span>
                                    </div>
                                    <div
                                      class="modal fade"
                                      id="commentModal"
                                      tabindex="-1"
                                      role="dialog"
                                      aria-labelledby="commentModalLabel"
                                      aria-hidden="true"
                              >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Comment</h5>
                    <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onclick= "clearInput()"
                    >
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modalComment">
                    <form id="modalCommentForm" name="modalCommentForm" enctype="multipart/form-data">
                        <div class="modalCommentInput form-group">
                            <input  type="text" id="comment-content" name="comment" class="form-control" id="commentModalTextArea" rows="1" placeholder="Comment here" required='true'></input>
                        </div>
                        <button id="comment-post1" form="modalCommentPost" type="submit" class="commentPostButton " data-userId="${
                          element.developerId._id
                        }" data-postId="${
            element?._id
          }" data-isManager="0" aria-hidden="true">Post Comment</button>
                    </form>
                </div>
                <hr class="commentHr">
                <div class="modalAllComments">
                    <div class="modalCommentWrapper">
                    </div>
                </div>
            </div>
        </div>
    </div>
                                </div>`);
        } else {
          let userId =
            element.managerId._id?.toString() + "/" + element?._id + "1";
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
                                        <span class="postDate">${new Date(
                                          element.createdAt
                                        ).toLocaleDateString()}</span>
                                    </div>
                                  
                                </div>
                                <div class="postCenter">
                                    <img class="postImg" src="http://localhost:3000/images/${
                                      element?.fileUpload?.filename
                                    }" alt="" />
                                    <span class="postText"> ${
                                      element?.description
                                    }  </span>
                                </div>
                                 <div class="postBottom">
                                    <div class="postBottomLeft">

                                    <button class="invoke-like" data-userId="${
                                      element.managerId._id
                                    }" data-postId="${
            element?._id
          }" data-isManager="1" onclick="likePost(event)">
                                    <img
                                    data-userId="${
                                      element.managerId._id
                                    }" data-postId="${
            element?._id
          }" data-isManager="1"
                                    class="likeIcon"
                                    src="http://localhost:3000/img/${
                                      element.likedBy.indexOf(
                                        element.managerId._id
                                      ) >= 0
                                        ? "heart.png "
                                        : "heartless.png"
                                    } "
                                    alt=""
                        
                                    />
                                </button>
                                    <span class="postLikeCounter">${
                                      element.likeCount
                                    }  people like this</span>
                                    </div>
                                    <div class="postBottomRight" data-toggle="modal" data-target="#commentModal">
                                    <span class="postCommentText" data-userId="${
                                      element.managerId._id
                                    }" data-postId="${
            element?._id
          }" data-isManager="1" 
          data-username=${element.managerId.name}>
                                    Comments</span>
                                    </div>
                                    <div
                                      class="modal fade"
                                      id="commentModal"
                                      tabindex="-1"
                                      role="dialog"
                                      aria-labelledby="commentModalLabel"
                                      aria-hidden="true"
                              >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Comment</h5>
                    <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onclick= "clearInput()"
                    >
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modalComment">
                    <form id="modalCommentForm" name="modalCommentForm" enctype="multipart/form-data">
                        <div class="modalCommentInput form-group">
                            <input  type="text" id="comment-content" name="comment" class="form-control" id="commentModalTextArea" rows="1" placeholder="Comment here" required='true'></input>
                        </div>
                        <button id="comment-post1" form="modalCommentPost" type="submit" class="commentPostButton " data-userId="${
                          element.managerId._id
                        }" data-postId="${
            element?._id
          }" data-isManager="1"  aria-hidden="true">Post Comment</button>
                    </form>
                </div>
                <hr class="commentHr">
                <div class="modalAllComments">
      
                </div>
            </div>
        </div>
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

  $(".postComment").click((e) => {
    console.log("postComment", e);
  });
});

function clearInput() {
  document.getElementById("exampleFormControlTextarea11").value = "";
  document.getElementById("exampleFormControlTextarea12").value = "";
}

function postComment(e) {
  e.preventDefault();
  console.log("button clicked");
  let url = "/post/reply";
  let userId = "6431df1f073b421313df0b53";
  let postId = "643f4f02e84ecc0d0287986f";
  let isManager = "1";
  var data = {
    UserId: userId,
    content: "this is my first comment",
    postId: postId,
  };
  $.ajax({
    type: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
    dataType: "json",
    success: function (data) {
      // window.location.href = data.redirect;
      console.log(data);
    },
    error: function (e) {
      console.log(e);
      alert("Error while login manager", e);
    },
  });

  // $.ajax({
  //   type: "POST",
  //   url:url,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   data: JSON.stringify(data),
  //   dataType: "json",
  //   success: function (data) {
  //     // window.location.href = data.redirect;
  //     console.log(data);

  //   },
  //   error: function (e) {
  //     console.log(e)
  //     alert("Error while login manager",e);
  //   },
  // });
}

function clearInput() {
  document.getElementById("comment-content").value = "";
}

function likePost(e) {
  e.preventDefault();
  let userId = e.target.dataset.userid;
  let postId = e.target.dataset.postid;
  let isManager = e.target.dataset.ismanager;
  let url =
    isManager == "0"
      ? "/developer/post/likeDocument"
      : "/manager/post/likeDocument";
  var data = {
    UserId: userId,
    postId: postId,
  };

  $.ajax({
    type: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
    dataType: "json",
    success: function (data) {
      // window.location.href = data.redirect;
      console.log(data);
      if (!data.like) {
        // add image for non liked image
        document.querySelectorAll(`[data-postId="${postId}"]`)[0].innerHTML =
          "";
        document.querySelectorAll(`[data-postId="${postId}"]`)[0].innerHTML = `
            <img
            data-userId="${userId}" data-postId="${postId}" data-isManager="${isManager}"
                class="likeIcon invoke-like"
                src="http://localhost:3000/img/heartless.png"
                alt=""

            />`;
      } else {
        // add image for liked image
        document.querySelectorAll(
          `[data-postId="${data.like.postId}"]`
        )[0].innerHTML = "";
        document.querySelectorAll(
          `[data-postId="${data.like.postId}"]`
        )[0].innerHTML = `
            <img
            data-userId="${data?.like?.UserId}" data-postId="${data?.like?.postId}" data-isManager="${isManager}"
                class="likeIcon invoke-like new"
                src="http://localhost:3000/img/heart.png"
                alt=""

            />
            `;
      }
    },
    error: function (e) {
      console.log(e);
      alert("Error while login manager", e);
    },
  });
}
