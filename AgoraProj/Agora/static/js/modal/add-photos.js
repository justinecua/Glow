let ImagePost = document.getElementById('Image-Post');
let PhotoUploadContainer = document.getElementById('Photo-upload-container');
let PhotoUploadContainer2 = document.getElementById('Photo-upload-container2');
let PUCImageCont = document.getElementById('PUC-ImageCont');
let RemovePostImage = document.getElementById('Remove-Post-Image');
let RemovePostImage2 = document.getElementById('Remove-Post-Image2');
let posttextarea = document.getElementById('post-textarea');
let UserPostBtn = document.getElementById("User-PostBtn");
let ModalBottom3 = document.querySelector('.Modal-Bottom3');


let Photos = [];

export function PostPhotos(updateSizeCallback) {
    PhotoUploadContainer.addEventListener('click', function() {
        ImagePost.click();
    });

    ImagePost.addEventListener('change', showPic); 
    
    function showPic() {
        let totalSizeForNewFiles = 0;

        for (let i = 0; i < ImagePost.files.length; i++) {
            totalSizeForNewFiles += ImagePost.files[i].size;
        }

        if (!updateSizeCallback(totalSizeForNewFiles)) {
            UserPostBtn.disabled = true;
            UserPostBtn.style.opacity = "30%";
            return;
        }
        else{
            UserPostBtn.disabled = false;
            UserPostBtn.style.opacity = "100";
        }

        for (let i = 0; i < ImagePost.files.length; i++) {
            let selectedFileStudPic = ImagePost.files[i];
            let fileName = selectedFileStudPic.name;

            if (!Photos.some(photo => photo.name === fileName)) {
                let reader = new FileReader();
                reader.onload = function(event) {
                    let img = new Image();
                    img.onload = function() {
                        let canvas = document.createElement('canvas');
                        let ctx = canvas.getContext('2d');
                        let maxSize = 800; 

                        let width = img.width;
                        let height = img.height;
                        if (width > height) {
                            if (width > maxSize) {
                                height *= maxSize / width;
                                width = maxSize;
                            }
                        } else {
                            if (height > maxSize) {
                                width *= maxSize / height;
                                height = maxSize;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);

                        let fileURL = canvas.toDataURL('image/jpeg'); 
                        let photoObject = {
                            name: fileName,
                            url: fileURL,
                            origurl: img.src,
                            size: selectedFileStudPic.size 
                        };

                        Photos.unshift(photoObject);

                        let ImageContainer = document.createElement('div');
                        ImageContainer.className = "ImageContainer";

                        let CoverImage = document.createElement('img');
                        let DelImage = document.createElement('div');
                        let DelImageCont = document.createElement('div');
                        
                        DelImage.innerHTML = "&times";
                        DelImageCont.className = "DelImageCont";
                        DelImage.className = "DelImage";
                        DelImage.addEventListener('click', function(event) {
                            event.stopPropagation();
                            let index = Photos.findIndex(photo => photo.name === fileName);

                            updateSizeCallback(-Photos[index].size);
                            Photos.splice(index, 1);
                            ImageContainer.remove();
                            console.log(Photos);

                            if( Photos.length == 0){
                                PUCImageCont.style.display = "none";
                                PhotoUploadContainer2.style.display = "none";
                                posttextarea.style.height = "12rem";
                                ModalBottom3.style.display = "none";
                            }
                        });

                        ModalBottom3.style.display = "flex";
                        CoverImage.className = "CPPhotos";
                        CoverImage.src = fileURL;

                        PhotoUploadContainer.style.display = "none";
                        PUCImageCont.style.display = "flex";
                        RemovePostImage.style.display="none";
                        PhotoUploadContainer2.style.padding = "0.5rem";

                        DelImageCont.appendChild(DelImage);
                        ImageContainer.appendChild(DelImageCont);
                        ImageContainer.appendChild(CoverImage);
                        PUCImageCont.insertBefore(ImageContainer, PUCImageCont.firstChild);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(selectedFileStudPic);
            }
        }
    }
}

export function getPhotos() {
    return Photos;
}

export function insertEmoji(emoji) {
    var textarea = document.getElementById("post-textarea");
    var cursorPos = textarea.selectionStart;
    var textBeforeCursor = textarea.value.substring(0, cursorPos);
    var textAfterCursor = textarea.value.substring(cursorPos);

    textarea.value = textBeforeCursor + emoji + textAfterCursor;
    textarea.selectionStart = textarea.selectionEnd = cursorPos + emoji.length;
    
    let Caption = textarea.value;
    return Caption;
}
