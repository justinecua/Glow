let posttextarea = document.getElementById('post-textarea');
let PhotoUploadContainer = document.getElementById('Photo-upload-container');
let PhotoUploadContainer2 = document.getElementById('Photo-upload-container2');


export function addImagePost(){
    posttextarea.style.height = "3rem";
    PhotoUploadContainer.style.display = "flex";
    PhotoUploadContainer.style.height = "10rem";
    PhotoUploadContainer2.style.display = "flex";

}