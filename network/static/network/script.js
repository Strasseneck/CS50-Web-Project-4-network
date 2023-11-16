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

// Editing posts

// Show button on hover
$('.post-container').on({
    mouseenter: function () {
        console.log('mouse enter');
        let postId = $(this).attr('id');
        let postAuthor = $(this).find('#user-profile').text();
        let currentUser = $('#current-user-username').text();

        if(currentUser === postAuthor) {
            // checks if author and creates button
            let editButton = $('<input>');
            editButton.addClass('btn btn-primary btn-sm');
            editButton.attr('type', 'button');
            editButton.attr('id', 'edit-post-button');
            editButton.val('Edit Post');
            editButton.on('click', editPost(postId));
            editButton.appendTo(`#button-container${postId}`)
        }
    },
    mouseleave: function () {
        // Removes button if exists
        console.log('mouse leave');
        let $editButton = $('#edit-post-button');
        if($editButton.length !== 0) {
            $editButton.remove();
        }
    }
});

// Edit post function
function editPost(postId) {
    console.log('edit post clicked')
}

// Save post function
function savePost(postId) {
    console.log('Save Post');
    console.log(postId);
}
