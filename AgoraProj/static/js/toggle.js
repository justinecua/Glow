

let toggleTheme = document.getElementById('toggleTheme');

toggleTheme.addEventListener('click', async () =>{
    const { toggleTheme } = await import ("./appearance.js");
    
    toggleTheme();
})



