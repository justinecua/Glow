export function getPost(dataPostID, currentPhotoIndex) {

    let loadingBar = document.getElementById('loadingIndicator-Comment');
    loadingBar.style.display = 'flex';

    let transitionInProgress = false;

    let CCLeft1 = document.querySelector('.CC-Left');
    let CCRight1 = document.querySelector('.CC-Right');
    let CCLeft = document.querySelector('.CC-Left-Images');
    let nextButton = document.querySelector('.next-button');
    let prevButton = document.querySelector('.prev-button');
    let PostFullName = document.querySelector('.Post-FullName');
    let PostProfilePic = document.querySelector('.Post-ProfilePic');
    let PostCaption = document.querySelector('.Post-Caption');
    let Commentbtncont = document.querySelector('.Comment-btn-cont');
    let CaptionContent = document.querySelector('.Caption-Content');
    let photos = [];

    fetch(`/getCommentPost/${dataPostID}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        return response.json();
    })
    .then(result => {
        loadingBar.style.display = 'none';

        photos = result.photos;

        if (photos.length > 0) {
            CCLeft.innerHTML = '';
            CCLeft1.style.display = "flex";
            CCLeft1.style.width = "40rem";
            CCLeft.style.borderRadius = "10px";
            CCRight1.style.borderRadius = "10px";
            CCRight1.style.width = "40rem";

            photos.forEach(function (photo, index) {
                var img = document.createElement('img');
                img.className = "lazy";
                img.src = photo.url;
                img.dataset.src = photo.url;
                img.style.display = index === currentPhotoIndex ? 'block' : 'none';
                CCLeft.appendChild(img);
            });
            LazyLoading(".lazy");
            prevButton.style.display = currentPhotoIndex === 0 ? "none" : "flex";
            nextButton.style.display = currentPhotoIndex === photos.length - 1 ? "none" : "flex";
            Commentbtncont.style.justifyContent = photos.length > 1 ? (currentPhotoIndex === 1 ? "space-between" : (currentPhotoIndex === photos.length - 1 ? "flex-start" : "end")) : "space-between";

            nextButton.addEventListener('click', showNextPhoto);
            prevButton.addEventListener('click', showPrevPhoto);

        } else {
            nextButton.style.display = "none";
            prevButton.style.display = "none";
            CCLeft1.style.display = "none";
            CCRight1.style.borderRadius = "10px";
            CCRight1.style.width = "40rem";
        }

        let account = result.accountInfo;
        PostFullName.innerHTML = account.firstname + " " + account.lastname;

        let DefaultAvatar = '../static/images/default-avatar-profile-picture-male-icon.png';

        if (account.profile_photo === DefaultAvatar) {
            PostProfilePic.src = DefaultAvatar;
        } else {
            PostProfilePic.src = account.profile_photo + '/tr:q-100,tr:w-42,h-42';
        }


        PostCaption.innerText = result.post.caption;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


    function showNextPhoto() {
        if (!transitionInProgress && currentPhotoIndex < photos.length - 1) {
            transitionInProgress = true;
            currentPhotoIndex++;
            updateImageDisplay();
            setTimeout(() => {
                transitionInProgress = false;
            }, 500);
        }
    }

    function showPrevPhoto() {
        if (!transitionInProgress && currentPhotoIndex > 0) {
            transitionInProgress = true;
            currentPhotoIndex--;
            updateImageDisplay();
            setTimeout(() => {
                transitionInProgress = false;
            }, 500);
        }
    }

    function updateImageDisplay() {
        CCLeft.querySelectorAll('img').forEach((img, index) => {
            img.style.display = index === currentPhotoIndex ? 'flex' : 'none';
        });
        prevButton.style.display = currentPhotoIndex === 0 ? "none" : "flex";
        nextButton.style.display = currentPhotoIndex === photos.length - 1 ? "none" : "flex";
        Commentbtncont.style.justifyContent = photos.length > 1 ? (currentPhotoIndex === 1 ? "space-between" : (currentPhotoIndex === photos.length - 1 ? "flex-start" : "end")) : "space-between";

    }
}

export function LazyLoading(selector) {
    let lazyimages = document.querySelectorAll(selector);

    if ("IntersectionObserver" in window) {
        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let lazyimage = entry.target;
                    lazyimage.src = lazyimage.dataset.src;
                    lazyimage.classList.remove("lazy");
                    observer.unobserve(lazyimage);
                }
            });
        });

        lazyimages.forEach((lazyimage) => {
            observer.observe(lazyimage);
        });
    }
}

