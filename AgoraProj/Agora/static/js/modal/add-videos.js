let VideoPost = document.getElementById('Video-Post');
let VideoUploadContainer = document.getElementById('Video-upload-container');
let PUCVideoCont = document.getElementById('PUC-VideoCont');
let RemovePostVideo = document.getElementById('Remove-Post-Video');
let VideoUploadContainer2 = document.getElementById('Video-upload-container2');
let posttextarea = document.getElementById('post-textarea');
let Videos = [];

export function PostVideos(updateSizeCallback) {
    VideoUploadContainer.addEventListener('click', () => VideoPost.click());

    VideoPost.addEventListener('change', handleVideoUpload);

    function handleVideoUpload() {
        Array.from(VideoPost.files).forEach(file => {
            if (!Videos.some(video => video.name === file.name)) {
                const reader = new FileReader();
                const objectURL = URL.createObjectURL(file);
                updateSizeCallback(file.size);
                const videoElement = createVideoElement(file.name, objectURL);
                PUCVideoCont.insertBefore(videoElement.container, PUCVideoCont.firstChild);

                reader.onload = function(event) {
                    const base64Data = event.target.result;
                    Videos.unshift({
                        name: file.name,
                        size: file.size,
                        file: base64Data
                    });
                    console.log(Videos);
                };
                VideoUploadContainer.style.display = "none";
                PUCVideoCont.style.display = "flex";
                reader.readAsDataURL(file);
            }
        });
        console.log(Videos);
    }

    function createVideoElement(fileName, src) {
        let container = document.createElement('div');
        container.className = "ImageContainer";

        let video = document.createElement('video');
        video.className = "CPVideos";
        video.src = src;
        video.controls = true;

        let deleteDiv = document.createElement('div');
        deleteDiv.className = "DelVideo";
        deleteDiv.innerHTML = "&times";
        deleteDiv.addEventListener('click', () => {
            let index = Videos.findIndex(video => video.name === fileName);
            if (index !== -1) {
                updateSizeCallback(-Videos[index].size);
                Videos.splice(index, 1);
                URL.revokeObjectURL(src); // Free memory
                container.remove();
            }

            if( Videos.length == 0){
                PUCVideoCont.style.display = "none";
                VideoUploadContainer2.style.display = "none";
                posttextarea.style.height = "12rem";
            }
        });

        RemovePostVideo.style.display = "none";
        VideoUploadContainer2.style.padding = "0.5rem";
        let delContainer = document.createElement('div');
        delContainer.className = "DelVideoCont";
        delContainer.appendChild(deleteDiv);

        container.appendChild(delContainer);
        container.appendChild(video);

        return { container, video };

        
    }
}

export function getVideos() {
    return Videos;
}