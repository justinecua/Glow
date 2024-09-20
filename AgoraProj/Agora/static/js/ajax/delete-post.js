let messages = document.getElementById('messages');
let DeletePostOverlay = document.getElementById('DeletePost-Overlay');
let loader = document.querySelector('.loader6');

export function deletePost(id) {
    loader.style.display = 'flex';
    fetch(`deletePost/${id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            console.log(result.message);
            messages.innerHTML = result.message;
            messages.style.display = "flex";
            DeletePostOverlay.style.display = "none";

            let postContainer = document.querySelector(`.User-Post-Container2[data-postid="${id}"]`);
            if (postContainer) {
                postContainer.remove();
            }

            let imageContainers = document.querySelectorAll(`.UPC-content2[data-postid="${id}"]`);
            imageContainers.forEach(image =>{
                image.remove();
            });

            loader.style.display = 'none';

            setTimeout(function () {
                messages.style.opacity = '1';
            }, 100);

            setTimeout(function () {
                messages.style.opacity = '0';
            }, 3000);
        } else {
            loader.style.display = 'none';
            console.error('Error:', result.message);
        }
    })
    .catch(error => {
        loader.style.display = 'none';
        console.error('Error fetching data:', error);
    });
}
