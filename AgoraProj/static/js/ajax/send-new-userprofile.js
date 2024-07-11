let PopUpContainer3 = document.getElementById('PopUp-Container3');
let PopUpContainer2 = document.getElementById('PopUp-Container2');

export function sendNewUserProf(nwObject) {
    let messagebox = document.getElementById('message-box');

    const formData = new FormData();
    formData.append('default_profile_url', nwObject.profile); 
    formData.append('data', JSON.stringify({
        firstname: nwObject.firstname,
        lastname: nwObject.lastname,
        gender: nwObject.gender,
        birthday: nwObject.birthday
    }));

    const options = {
        method: 'POST',
        body: formData,
    };

    fetch("dashboard/uploadprofile", options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            messagebox.textContent = data.message;
            PopUpContainer2.style.display = "none";
            PopUpContainer3.style.display = "flex";
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}
