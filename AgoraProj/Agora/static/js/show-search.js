let SearchNav = document.getElementById('SearchNav');
let SearchContainer = document.querySelector('.Search-Container');


SearchNav.addEventListener('click', async() =>{
    const { ShowSearch } = await import ("./modal/show-search.js");
    
    ShowSearch();
})

SearchContainer.addEventListener('click', function(event) {
    event.stopPropagation();
});

document.addEventListener('click', function(event) {
    if (!SearchContainer.contains(event.target)) {
        SearchContainer.style.display = "none";
    }
});


let CreateBtnNav = document.getElementById('Create-Btn-Nav');

CreateBtnNav.addEventListener('click', async() =>{
    const { switchModal } = await import ("./modal/switchmodal.js");
    
    switchModal();
})
