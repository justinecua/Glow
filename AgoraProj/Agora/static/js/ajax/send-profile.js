let loader = document.querySelector('.loader7');

export function sendProfile(id, profileObject) {
    loader.style.display = 'flex';
    const formData = new FormData();
    formData.append('profile_photo', profileObject);
    formData.append('accID', id);

    fetch(`sendNewProfile/`, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            if (result.status === 'success') {
                window.location.href = result.redirect;
                loader.style.display = 'none';

            } else {
                loader.style.display = 'none';
                message.innerHTML = result.message;
            }
        } else {
            console.error('Error:', result.message);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  }
