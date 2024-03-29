$(document).ready(() => {
    $('#button-addon2').click((e) => {
        e.preventDefault()
        var query = $('#button-addon2').data('userid')
        var data = {
            name: $('#ClassName').val()
        };

        $.ajax({
            type: 'POST',
            url: '/search',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            dataType: "json",
            success: function(data) {
                $('.b').remove()
                var flag = 0
                if (data.students) {
                    var students = Object.keys(data.students)
                    students.forEach(element => {
                        if (element == query) {
                            return flag = 1
                        }
                    });
                    if (flag == 1) {
                        $('#append').append(`<div class="row border-top b" >
                                  <img class="developer" src="/img/apple-icon-114x114.png" alt="">
                                  <span class="username">${data.name}</span>
                                  <button type="button" class="edit followClass" class="btn btn-primary" data-userid = "${data._id}"  >Unfollow
                                  </button>
                              </div>
                              <div class="row b"><span class="twitter-handle b">${data.description}</span></div>
                              <div class="row b">
                              <div class="follow">${Object.keys(data.students).length} Following</div>
                              
                              </div>`)
                    } else {
                        $('#append').append(`<div class="row border-top b" >
                                  <img class="developer" src="/img/apple-icon-114x114.png" alt="">
                                  <span class="username">${data.name}</span>
                                  <button type="button" class="edit followClass" class="btn btn-primary" data-userid = "${data._id}" >Follow
                                  </button>
                              </div>
                              <div class="row b"><span class="twitter-handle b">${data.description}</span></div>
                              <div class="row b">
                              <div class="follow">${Object.keys(data.students).length} Following</div>
                              
                              </div>`)
                    }
                } else {
                    $('#append').append(`<div class="row border-top b" >
                                  <img class="developer" src="/img/apple-icon-114x114.png" alt="">
                                  <span class="username">${data.name}</span>
                                  <button type="button" class="edit followClass" class="btn btn-primary" data-userid = "${data._id}" >Follow
                                  </button>
                              </div>
                              <div class="row b"><span class="twitter-handle b">${data.description}</span></div>
                              <div class="row b">
                              <div class="follow">0 Following</div>
                              
                              </div>`)
                }


            },
            error: function() {
                alert('No class found')
            }
        })
        $('#ClassName').val('').empty()
    })


    $('#append').on('click', 'button', function(e) {
        var data = {
            id: $(this).data('userid')
        }

        $.ajax({
            type: 'POST',
            url: '/developer/follow',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            dataType: "json",
            success: function(data1) {
                var following = Object.keys(data1.following)
                var flag = 0
                following.forEach(element => {
                    if (element == data.id) {
                        flag = 1
                        return
                    }
                });
                if (flag == 1) {
                    $('button.followClass').html('UnFollow')

                } else {
                    $('button.followClass').html('Follow')

                }
            },
            error: function() {
                alert('Error while login developer')

            }
        })
    })
})