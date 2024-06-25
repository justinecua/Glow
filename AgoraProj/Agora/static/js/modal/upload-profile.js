<<<<<<< HEAD
let Profilefile = document.getElementById('nw-profilepic');
let defaultProfile = document.getElementById('default-profile');
let file = '';
let messagebox = document.getElementById('message-box');
=======
let Profilefile = document.getElementById('Profile-file');
let defaultProfile = document.getElementById('default-profile');
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17

export function UploadProf() {
    Profilefile.click();
    Profilefile.addEventListener('change', showEvCPic); 

    function showEvCPic() {
<<<<<<< HEAD
        if (!Profilefile.files || Profilefile.files.length === 0) {
            defaultProfile.src  = '../static/images/default-avatar-profile-picture-male-icon.png';
        }

        let selectedFile = Profilefile.files[0];

        if (selectedFile.size > 5 * 1024 * 1024) { 
            messagebox.textContent = "File size exceeds 5MB. Please choose a smaller file.";
            Profilefile.value = ''; 
            return;
        }

        let reader = new FileReader();

=======
        let selectedFile = Profilefile.files[0];
        let reader = new FileReader();
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
        reader.onload = function (event) {
            let img = new Image();
            img.onload = function () {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                let maxSize = 800;

                let width = img.width;
                let height = img.height;
<<<<<<< HEAD

=======
            
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
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
<<<<<<< HEAD
                file = defaultProfile.src;
            
=======
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
            };
            img.src = event.target.result; 
        };
        reader.readAsDataURL(selectedFile); 
    }
}
<<<<<<< HEAD

export function Profile_URL() {
    return Profilefile.files[0]; 
}
=======
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
