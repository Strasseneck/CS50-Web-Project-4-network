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

// Edit post

$('#edit-post-button').on('click', function () {

    console.log('edit post clicked')
    // Get the post body id
    let postBodyId = $('#post-body-id').val();

    console.log(postBodyId);

    // Get post id
    let postId = $('#post-id').val();

    // Get the posts body content
    let $postBody = $(`#${postBodyId}`);
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
    let $editButton = $('#edit-post-button');

    // Replace edit post button with save post button
    let $saveButton = $('<input>');
    $saveButton.addClass('btn btn-primary btn-sm');
    $saveButton.attr('type', 'button');
    $saveButton.val('Save Post');
   
   
    $saveButton.on('click', function () {

        // Get new body content
        let newBodyContent = $('#new-body').val();
        
        // Replace text area with body again
        $postBody.text(newBodyContent);
        $editableBody.replaceWith($postBody);

        // Replace save button with edit button
        savePost(postId);
    })
    
    $editButton.replaceWith($saveButton);
})

// Save post function

function savePost(postId) {
    console.log('Save Post');
    console.log(postId);

}
