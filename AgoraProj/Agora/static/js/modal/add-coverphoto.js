let EPCPPhotoCont = document.querySelector('.EPCP-PhotoCont');
let UserCoverPhoto = document.getElementById('User-CoverPhoto');
let SelectedCoverPhoto = document.getElementById('Selected-CoverPhoto');
let EPCPProfCont = document.querySelector('.EPCP-ProfCont');
let coverCameraDefault = document.getElementById('cover-cameraDefault');
let CoverPhotoObject = '';

export function AddCoverPhoto() {
    EPCPPhotoCont.addEventListener('click', function () {
        UserCoverPhoto.click();
    });

    UserCoverPhoto.addEventListener('change', showCoverPhoto)
    
    function showCoverPhoto() {
        let selectedFile = UserCoverPhoto.files[0];
        let fileName = selectedFile.name;

        let reader = new FileReader();
        reader.onload = function (event) {
            let img = new Image();
            img.onload = function () {
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

                SelectedCoverPhoto.src = canvas.toDataURL('image/jpeg');
                let fileURL = canvas.toDataURL('image/jpeg'); 

                CoverPhotoObject = {
                    name: fileName,
                    url: fileURL,
                    origurl: img.src,
                    size: selectedFile.size 
                };

               // console.log(CoverPhotoObject);
                EPCPPhotoCont.appendChild(SelectedCoverPhoto); 
                SelectedCoverPhoto.style.display = "flex";
                EPCPPhotoCont.style.display = "flex";
                coverCameraDefault.style.display = "none";
            };
            img.src = event.target.result; 
        };
        reader.readAsDataURL(selectedFile); 
    
    }

}

export function getCoverPhoto() {
    return CoverPhotoObject ;
}