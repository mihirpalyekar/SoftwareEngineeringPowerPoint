console.log('document loaded')

$(document).ready(() => {

    $('#creatClass').click((e) => {
        e.preventDefault()

        var data = {};

        $('#topClassCreate').serializeArray().forEach((element) => {

            if (element.value) {
                data[element.name] = element.value;
            }
        });
        console.log(data);
        $.ajax({
            type: 'POST',
            url: '/chatRoom/create',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            dataType: "json",
            success: function(data) {
                alert('Chat room created Succesfully')
            },
            error: function(e) {
                alert('Chat room name already taken')
                console.log(e);
            }
        })
    })

    $.ajax({
        type: 'GET',
        url: '/manager/loadHome',
        success: function(data) {
            data.forEach(element => {

                if (element.developerId) {
                    $('#toAppend').prepend(`
            <div class="append-info">
            <div class="info-image">
            <img src="http://localhost:3000/images/${element?.fileUpload?.filename}"  width="200" height="200" >
            </div>
            <div class ="info-data">
            <div class="data-name">Chat Room name : ${element?.name}</div>
            <div class="data-description"> <b>Description for the document</b> : <br>${element?.description}
            
            </div>
            <div class="data-name"> <b>Uploaded by</b> :${element?.developerId?.name} </div>
            </div>
            </div>
        <div class="border-bottom"></div>`);
                } else {
                    $('#toAppend').prepend(`
            <div class="append-info">
            <div class="info-image">
            <img src="http://localhost:3000/images/${element?.fileUpload?.filename}"  width="200" height="200"  >
            </div>
            <div class ="info-data">
            <div class="data-name">Chat Room name : ${element?.name}</div>
            <div class="data-description"> <b>Description for the document</b> : <br>${element?.description}
            </div>
            <div class="data-name"> <b>Uploaded by</b> :${element?.managerId.name} </div>
            </div>
            </div>
        <div class="border-bottom"></div>`);

                }
            });
        },
        error: function() {
            alert('Error while loading profile')
        }
    })
})