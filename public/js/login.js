$(document).ready(function() {
    $('#login-submit').click((e) => {
        e.preventDefault()
        var data = {};

        $('#loginForm').serializeArray().forEach((element) => {
            if (element.value) {
                data[element.name] = element.value;
            }
        });

        if (data.userType == 'Teacher') {
            $.ajax({
                type: 'POST',
                url: '/login/teacher',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(data),
                dataType: "json",
                success: function(data) {
                    window.location.href = data.redirect;
                },
                error: function() {
                    alert('Error while login teacher')

                }
            })
        } else {
            $.ajax({
                type: 'POST',
                url: '/login/user',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(data),
                dataType: "json",
                success: function(data) {
                    window.location.href = data.redirect;
                },
                error: function() {
                    alert('Error while login user')

                }
            })
        }
    });

})

$('#register-submit').click((e) => {
    e.preventDefault()

    var data = {};

    $('#registerForm').serializeArray().forEach((element) => {

        if (element.value) {
            data[element.name] = element.value;
        }
    })
    if (data.userType == 'Teacher') {
        $.ajax({
            type: 'POST',
            url: '/register/teacher',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            dataType: "json",
            success: function(data) {
                window.location.href = data.redirect;
            },
            error: function() {
                alert('Error while creating teacher')

            }
        })
    } else {
        $.ajax({
            type: 'POST',
            url: '/register/user',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            dataType: "json",
            success: function(data) {
                window.location.href = data.redirect;
            },
            error: function() {
                alert('Error while creating user')

            }
        })
    }
})