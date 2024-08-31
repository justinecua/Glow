let posttextarea = document.getElementById('post-textarea');
let VideoUploadContainer = document.getElementById('Video-upload-container');
let VideoUploadContainer2 = document.getElementById('Video-upload-container2');

export function addVideoPost(){
    posttextarea.style.height = "3rem";
    VideoUploadContainer.style.display = "flex";
    VideoUploadContainer.style.height = "10rem";
    VideoUploadContainer2.style.display = "flex";
}