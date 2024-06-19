
let LogoutOverlay = document.getElementById('Logout-Overlay');


export function logout(){
    
    const options = {
        method: 'GET',
    }

    fetch("account/logout/", options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            
            
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });

}