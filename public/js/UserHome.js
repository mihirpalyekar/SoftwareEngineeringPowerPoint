$(document).ready(() => {
    $.ajax({
        type: 'GET',
        url: '/user/loadHome',
        success: function(data) {
            data.forEach(element => {

                if (element.studentId) {
                    $('#toAppend').prepend(`
              <div class="append-info">
              <div class="info-image">
              <img src="http://localhost:3000/images/${element.fileUpload.filename}"  width="200" height="200" >
              </div>
              <div class ="info-data">
              <div class="data-name">Class Room name : ${element.name}</div>
              <div class="data-description"> <b>Description for the document</b> : <br>${element.description}
              
              </div>
              <div class="data-name"> <b>Uploaded by</b> :${element.studentId.name} </div>
              </div>
              </div>
          <div class="border-bottom"></div>`);
                } else {
                    $('#toAppend').prepend(`
              <div class="append-info">
              <div class="info-image">
              <img src="http://localhost:3000/images/${element.fileUpload.filename}"  width="200" height="200"  >
              </div>
              <div class ="info-data">
              <div class="data-name">Class Room name : ${element.name}</div>
              <div class="data-description"> <b>Description for the document</b> : <br>${element.description}
              </div>
              <div class="data-name"> <b>Uploaded by</b> :${element.teacherId.name} </div>
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