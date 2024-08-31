let EPPPCamera = document.querySelector('.EPPP-Camera');
let UserProfilePhoto = document.getElementById('User-ProfilePhoto');
let SelectedProfilePhoto = document.getElementById('Selected-ProfilePhoto');
let EPImageProf = document.getElementById('EP-ImageProf'); 
let EPProfilePhoto = document.querySelector('.EP-ProfilePhoto');
let ProfilePhotoObject = '';

export function AddProfilePhoto() {
    EPPPCamera.addEventListener('click', function () {
        UserProfilePhoto.click();
    });

    UserProfilePhoto.addEventListener('change', showProfilePhoto)
    
    function showProfilePhoto() {
        let selectedFile = UserProfilePhoto.files[0];
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

                SelectedProfilePhoto.src = canvas.toDataURL('image/jpeg');

                let fileURL = canvas.toDataURL('image/jpeg'); 

                ProfilePhotoObject = {
                    name: fileName,
                    url: fileURL,
                    origurl: img.src,
                    size: selectedFile.size 
                };

                //console.log(ProfilePhotoObject);

                EPProfilePhoto.appendChild(SelectedProfilePhoto); 
                SelectedProfilePhoto.style.display = "flex";
                EPImageProf.style.display = "none";
            
            };
            img.src = event.target.result; 
        };
        reader.readAsDataURL(selectedFile); 
    }

}

export function getProfilePhoto() {
    return ProfilePhotoObject;
}