'use strict';
// None of this works correctly to edit the completed checkbox for a todo item
// This might be replaced by a controller in a different view

// function getCookie(name) {
//   var value = "; " + document.cookie;
//   var parts = value.split("; " + name + "=");
//   if (parts.length == 2) return parts.pop().split(";").shift();
// }

// $('.completed-checker').on('change', '.completed-checkbox', function(e){
//     e.preventDefault();
//     var id = $(this).attr('data-id')
//     var value = $(this).val()
//     console.log(id)
//     $.ajax({
//         url: backendUrl + '/todo/' + id + '/',
//         method: 'POST',
//         beforeSend: function(xhr){
//             xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"))
//         },
//         success: function(){
//             console.log(value)
//             if (value === true){
//                 $('.completed-checker').append('<p>Your item has been marked "Completed"</p>')
//             } else {
//                 $('.completed-checker').append('<p>Your item has been marked "Not completed"</p>')
//             }
            
//         }
//     })
// })