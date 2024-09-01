import { HideNotif } from "./modal/hide-notif-modal.js";

let NotificationTab = document.getElementById('Notification-Tab');
let NotificationContainer = document.querySelector('.Notification-Container');
let CreateBtnNav = document.getElementById('Create-Btn-Nav');
let ModalOverlay = document.getElementById('Modal-Overlay');

NotificationTab.addEventListener('click', async () => {
    const { ShowNotif } = await import ("./modal/notif-modal.js");
    ShowNotif();
});

document.addEventListener('click', function(event) {
    if (!NotificationContainer.contains(event.target)) {
        HideNotif();
    }

});

/*
document.getElementById('Create-Btn-Nav').addEventListener('click', async () =>{

})

*/