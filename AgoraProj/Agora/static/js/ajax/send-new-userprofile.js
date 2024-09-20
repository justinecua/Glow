let PopUpContainer3 = document.getElementById('PopUp-Container3');
let PopUpContainer2 = document.getElementById('PopUp-Container2');
let loader = document.querySelector('.loader5');

export function sendNewUserProf(nwObject) {
    loader.style.display = 'flex';
    let messagebox = document.getElementById('message-box');

    const formData = new FormData();
    formData.append('profile_url', nwObject.profile);
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

            return response.json();
        })
        .then(response => {
            if (response.status === 'success') {
                window.location.href = response.redirect;
                loader.style.display = 'none';
                messagebox.textContent = data.message;
                PopUpContainer2.style.display = "none";
            } else {
                loader.style.display = 'none';
                message.innerHTML = response.message;
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}
