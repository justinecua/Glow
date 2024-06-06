let Profilefile = document.getElementById('Profile-file');
let defaultProfile = document.getElementById('default-profile');

export function UploadProf() {
    Profilefile.click();
    Profilefile.addEventListener('change', showEvCPic); 

    function showEvCPic() {
        let selectedFile = Profilefile.files[0];
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

                defaultProfile.src = canvas.toDataURL('image/jpeg');
            };
            img.src = event.target.result; 
        };
        reader.readAsDataURL(selectedFile); 
    }
}
