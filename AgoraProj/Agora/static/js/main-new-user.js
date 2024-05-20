let Modal1 = document.getElementById('PopUp-Container1');
let Modal2 = document.getElementById('PopUp-Container2');
let Modal3 = document.getElementById('PopUp-Container3');
let Modal1Button = document.getElementById('Modal1-Button');
let cameraprof = document.getElementById('camera-prof');
let PopUpOverlay = document.getElementById('PopUp-Overlay');

let Modals = [Modal1, Modal2, Modal3];
PopUpOverlay.style.display = "flex";

cameraprof.addEventListener('click', async () => {
    const { UploadProf } = await import ("./modal/upload-profile.js");
    UploadProf();
});


Modal1Button.addEventListener('click', async() =>{
    const { switchModal } = await import ("./modal/new-user.js")

    switchModal(Modal2, Modals);
})



