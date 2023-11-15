// Variables 

// Toggle Create New Post
$('#create-new-post').on('click', function() {
    console.log('here');
    $('#new-post-form').attr("style", "display: block");
})

// Close new post button
$('#close-button').on('click', function () {
    $('#new-post-form').attr("style", "display: none");
})

