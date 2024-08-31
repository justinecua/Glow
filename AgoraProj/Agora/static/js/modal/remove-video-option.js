let posttextarea = document.getElementById('post-textarea');
let VideoUploadContainer = document.getElementById('Video-upload-container');
let VideoUploadContainer2 = document.getElementById('Video-upload-container2');

export function removeVideoPost(){
    posttextarea.style.height = "12rem";
    VideoUploadContainer.style.display = "none";
    VideoUploadContainer2.style.display = "none";
}