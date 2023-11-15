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
    // Get the postid
    let postid = $('#post-id').val();

    // Get the posts body content
    let $postBody = $(`#${postid}`);
    let postBodyText = $postBody.text();

    // Create post body text area and populate with content
    let $editableBody = $('<textarea>');
    $editableBody.addClass('form-control');
    $editableBody.attr('name', 'new-body');
    $editableBody.val(postBodyText);

    // Replace the original body with the new editable body
    $postBody.replaceWith($editableBody);

    // Replace edit post button with save post button
    let $saveButton = $('<input>');
    $saveButton.addClass('btn btn-primary btn-sm');
    $saveButton.attr('type', 'button');
    $saveButton.val('Save Post');

    let $editButton = $('#edit-post-button');
    $editButton.replaceWith($saveButton);
})

