

let toggleTheme = document.getElementById('AppearanceNav');

toggleTheme.addEventListener('click', async () =>{
    const { toggleTheme } = await import ("./appearance.js");

    toggleTheme();
})



