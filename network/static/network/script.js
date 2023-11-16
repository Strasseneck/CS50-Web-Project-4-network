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
        // Check if savebutton exists
        let $saveButton = $('#save-post-button');
        if($saveButton.length !== 0) {
            // If exists return
            return;
        }
        // Get post, user data
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
            editButton.on('click', function () {
                editPost(postId)
            });
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
    // Get the post to edit
    let $post = $(`#${postId}`);

    $post.each(function() {
        // Get the post body
        let $postBody = $(this).find('#post-body');
        let postBodyText = $postBody.text();
        console.log(postBodyText);

        // Create post body text area and populate with content
        let $editableBody = $('<textarea>');
        $editableBody.addClass('form-control');
        $editableBody.attr("id", 'new-body');
        $editableBody.val(postBodyText);

        // Replace the original body with the new editable body
        $postBody.replaceWith($editableBody);

        // Get edit button
        let $editButton = $(this).find('#edit-post-button');

        // Replace edit post button with save post button
        let $saveButton = $('<input>');
        $saveButton.addClass('btn btn-primary btn-sm');
        $saveButton.attr('type', 'button');
        $saveButton.attr('id', 'save-post-button')
        $saveButton.val('Save Post');
        $saveButton.on('click', function () {
            savePost(postId)
        });
        $editButton.replaceWith($saveButton);  
    })
}

// Save post function
function savePost(postId) {
    console.log('Save Post');
    // Get the edited post
    let $editedPost = $(`#${postId}`);

    $editedPost.each(function () {
        // Remove save post button
        let $saveButton = $('#save-post-button');
        if($saveButton.length !== 0) {
            $saveButton.remove();
        }
        
        // Get the newbody content
        let $editedBody = $(this).find('#new-body');
        let newBodyContent = $editedBody.val();

        // Modify the DOM with new body
        let savedBody = $('<p>');
        savedBody.addClass('post-body');
        savedBody.attr('id', 'post-body');
        savedBody.text(newBodyContent);
        $editedBody.replaceWith(savedBody);

        // Send via Fetch to view
        fetch('/edit_post', {
            method: 'POST', 
            body: JSON.stringify({
                body: newBodyContent,
                postId: postId
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            console.log('message saved')
        })
    })
}
