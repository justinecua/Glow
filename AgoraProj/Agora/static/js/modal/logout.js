
let LogoutOverlay = document.getElementById('Logout-Overlay');


export function logout(){
    LogoutOverlay.style.display = "flex";
    document.body.style.overflowY = "hidden";
}