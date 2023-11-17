

// New post button event listener
$('#new-post-button').on('click', function() {
    newPost()
})

// New post function
function newPost() {
    $('#new-post-form').attr("style", "display: block");
    $('#new-post-button').remove();
}

// Close new post button
$('#close-button').on('click', function () {
    $('#new-post-form').attr("style", "display: none");
    
     // Add new post button
     let $newPostButton = $('<button>');
     $newPostButton.addClass('btn btn-primary');
     $newPostButton.text('New Post')
     $newPostButton.attr('type', 'button');
     $newPostButton.attr('id', 'new-post-button');
     $newPostButton.on('click', function() {
         newPost()
     });
     $newPostButton.appendTo('#new-post');
})

// Show Edit Post Button on hover
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
            let $editButton = $('<input>');
            $editButton.addClass('btn btn-primary btn-sm');
            $editButton.attr('type', 'button');
            $editButton.attr('id', 'edit-post-button');
            $editButton.val('Edit Post');
            $editButton.on('click', function () {
                editPost(postId)
            });
            $editButton.appendTo(`#button-container${postId}`)
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
        let $savedBody = $('<p>');
        $savedBody.addClass('post-body');
        $savedBody.attr('id', 'post-body');
        $savedBody.text(newBodyContent);
        $editedBody.replaceWith($savedBody);

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

// Like post button event listener
$('#like-post-button').on('click', function() {
    let postId = $(this).parent().attr('id');
    likePost(postId);
})

// Like post function
function likePost(postId) {
    console.log(`like post ${ postId }`);
    const val = '++';

    // Replace like button with unlike
    $('#like-post-button').attr("style", "display: none");
    $('#unlike-post-button').attr("style", "display: block");

    // Send via Fetch to view
    fetch('/like_post', {
        method: 'POST', 
        body: JSON.stringify({
            postId: postId
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
        console.log('post liked')
    })
    updateLikes(postId, val);
}

// Unlike post button event listener
$('#unlike-post-button').on('click', function() {
    let postId = $(this).parent().attr('id');
    unlikePost(postId);
})

// Unlike post function
function unlikePost(postId) {
    console.log(`unlike post ${ postId }`);
    const val = '--';

    // Replace unlike button with like
    $('#unlike-post-button').attr("style", "display: none");
    $('#like-post-button').attr("style", "display: block");

    // Send via Fetch to view
    fetch('/unlike_post', {
        method: 'POST', 
        body: JSON.stringify({
            postId: postId
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
        console.log('post unliked')
    })
    updateLikes(postId, val);
}

// Update likes function
function updateLikes(postId, val) {
    // Get the post to update
    let $post = $(`#${postId}`);

    $post.each(function () {
        // Get current likes
        let $currentLikes = $(this).find('#post-likes');
        let newLikes = parseInt($currentLikes.text());
        
        // Check val and increment
        if(val === '++') {
            newLikes++;
        }
        else if(val === '--') {
            newLikes--;
        }

        // Convert back to string
        newLikes = newLikes.toString();

        // Update the DOM with new likes
        $currentLikes.text(newLikes);
    })

   
}