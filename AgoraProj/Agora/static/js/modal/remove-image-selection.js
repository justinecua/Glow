let posttextarea = document.getElementById('post-textarea');
let PhotoUploadContainer = document.getElementById('Photo-upload-container');
let RemovePostImage2 = document.getElementById('Remove-Post-Image2');

export function removeImageSelection(){
    posttextarea.style.height = "3rem";
    PhotoUploadContainer.style.display = "none";
    RemovePostImage2.style.display = "none";
}   