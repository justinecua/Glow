
const navbar = document.getElementById('navbar');

function handleScroll() {
    if (window.scrollY > 0) {
        navbar.style.transition = 'all 0.5s ease'; 
        navbar.style.marginTop = '2%';
        navbar.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.063), rgba(255, 255, 255, 0))';
        navbar.style.backdropFilter = 'blur(1px)';
        navbar.style.webkitBackdropFilter = 'blur(10px)';
        navbar.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37)';
    } else {
        navbar.style.marginTop = '';
        navbar.style.background = '';
        navbar.style.backdropFilter = '';
        navbar.style.webkitBackdropFilter = '';
        navbar.style.border = '';
        navbar.style.boxShadow = '';
    }
}

window.addEventListener('scroll', handleScroll);

/*------------------------------------*/
let Menu = document.querySelector('.Menu');
let DownMenu = document.querySelector('.Down-Menu');

Menu.addEventListener('click', function(event){
    DownMenu.style.display = "flex";
    event.stopPropagation();
})

document.addEventListener('click', function(event) {
    
    if(!DownMenu.contains(event.target)){
        DownMenu.style.display = "none";
    }

});
