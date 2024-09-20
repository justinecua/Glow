
let Logoutbtn = document.getElementById('Logout-btn');
let LogoutOverlay = document.getElementById('Logout-Overlay');
let Logoutcontainer = document.getElementById('Logout-container');
let LCBack = document.getElementById('LC-Back');

LCBack.addEventListener('click', async() =>{
    LogoutOverlay.style.display = "none";
    document.body.style.overflowY = "auto";
})

Logoutbtn.addEventListener('click', async() =>{
    const { logout } = await import ("../js/modal/logout.js");
    logout();
})

