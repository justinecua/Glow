let posttextarea = document.getElementById('post-textarea');
let PhotoUploadContainer = document.getElementById('Photo-upload-container');
let PhotoUploadContainer2 = document.getElementById('Photo-upload-container2');

export function removeImagePost(){
    posttextarea.style.height = "12rem";
    PhotoUploadContainer.style.display = "none";
    PhotoUploadContainer2.style.display = "none";
}