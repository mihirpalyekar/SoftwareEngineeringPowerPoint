$(document).ready((e) => {
    $.ajax({
        type: 'GET',
        url: '/developer/profile',
        success: function(data) {

        },
        error: function() {
            alert('Error while loading profile')
        }
    })

    $('#editProfile').click((e) => {
        e.preventDefault()

        var data = {};

        $('#editProfileForm').serializeArray().forEach((element) => {

            if (element.value) {
                data[element.name] = element.value;
            }
        });
        $.ajax({
            type: 'PATCH',
            url: '/developer/profile/update',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            dataType: "json",
            success: function(data) {
                window.location.href = data.redirect;
            },
            error: function() {
                alert('Error while updating developer')

            }
        })
    })

    $.ajax({
        type: 'GET',
        url: '/developer/chatRoom/getDocument',
        success: function(data) {
            data.forEach(element => {
                $('#toappend').append(`
                <div class="append-info">
                <div class="info-image">
                <img src="http://localhost:3000/images/${element?.fileUpload?.filename}"  width="200" height="200" >
                </div>
                <div class ="info-data">
                <div class="data-name">Chat Room name : ${element?.name}</div>
                <div class="data-description"> <b>Description for the document</b> : <br>${element?.description}
                </div>
                </div>
                </div>
            <div class="border-bottom"></div>`);

            });
        },
        error: function(e) {
            alert('somthing went wrong while loading document')


        }
    })
})