export function getPost(dataPostID, currentPhotoIndex) {
<<<<<<< HEAD


    let loadingBar = document.getElementById('loadingIndicator-Comment');
    loadingBar.style.display = 'flex';

    let transitionInProgress = false;

    let CCLeft1 = document.querySelector('.CC-Left');
    let CCRight1 = document.querySelector('.CC-Right');
=======
    let transitionInProgress = false;

>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
    let CCLeft = document.querySelector('.CC-Left-Images');
    let nextButton = document.querySelector('.next-button');
    let prevButton = document.querySelector('.prev-button');
    let PostFullName = document.querySelector('.Post-FullName');
    let PostProfilePic = document.querySelector('.Post-ProfilePic');
    let PostCaption = document.querySelector('.Post-Caption');
    let Commentbtncont = document.querySelector('.Comment-btn-cont');
    let CaptionContent = document.querySelector('.Caption-Content');
    let CommentsSection = document.querySelector('.Comments-Section');
    let commentContainer = document.querySelectorAll('.Comment-Container');
    let photos = [];

<<<<<<< HEAD
    //Necessary to clear previous comments in the commentContainer
    commentContainer.forEach(comments =>{
        comments.style.visibility = "visible";
    })

    CCLeft.innerHTML = '';
    CCRight1.style.width = "";
    CCRight1.style.borderRadius = "";
    PostFullName.innerHTML = "";
    PostProfilePic.src = "";
    PostCaption.innerText = "";
    CommentsSection.innerHTML = "";
    nextButton.style.display = "none";
    prevButton.style.display = "none";
    Commentbtncont.style.justifyContent = "space-between";



=======
<<<<<<< HEAD
>>>>>>> ffbf4342142aebec24bbf93a73b4e367b8bd457e
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
            CCLeft1.style.width = "40rem";
            CCLeft.style.width = "100%";
            CCLeft.style.height = "";
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
            let NoImage = document.createElement('img');
            NoImage.className= "NoImage";
            NoImage.src = "https://ik.imagekit.io/b9bdd5j68/thinking-39.png";

            CCLeft.style.width = "60%";
            CCLeft.style.height = "60%";

            let NoImageText = document.createElement('span');
            NoImageText.innerHTML = "No images found";
            NoImageText.className= "NoImageText";
            CCLeft.appendChild(NoImage);
            CCLeft.appendChild(NoImageText);
            nextButton.style.display = "none";
            prevButton.style.display = "none";
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

        CommentsSection.innerHTML = '';
        if (result.comments.length > 0) {
            result.comments.forEach(comment => {
                var commentDiv = document.createElement('div');
                commentDiv.className = "commentDiv";

                var commentContent = document.createElement('p');
                commentContent.className = "commentContent";
                commentContent.textContent = comment.content;

                var commentName = document.createElement('p');
                commentName.className = "commentName";
                commentName.textContent = comment.firstname + " " + comment.lastname;

                var commentProf = document.createElement('img');
                commentProf.className = "commentProf";
                commentProf.src = comment.profile_photo;

                var commentDivRight = document.createElement('div');
                commentDivRight.className = "commentDivRight";
                commentDivRight.appendChild(commentName);
                commentDivRight.appendChild(commentContent);

                commentDiv.appendChild(commentProf);
                commentDiv.appendChild(commentDivRight);
                CommentsSection.appendChild(commentDiv);
            });
        } else {
            var noCommentsMessage = document.createElement('p');
            noCommentsMessage.className = "noCommentsMessage";
            noCommentsMessage.style.display = "flex";
            noCommentsMessage.style.height = "3rem";
            noCommentsMessage.style.justifyContent = "center";
            noCommentsMessage.textContent = "No comments";
            CommentsSection.appendChild(noCommentsMessage);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
=======
    var xhr = new XMLHttpRequest();

    xhr.open('GET', `/getCommentPost/${dataPostID}/`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    photos = response.photos;
                    if (photos.length > 0) {
                        CCLeft.innerHTML = '';
                        photos.forEach(function (photo, index) {
                            var img = document.createElement('img');
                            img.src = photo.url;
                            img.style.display = index === currentPhotoIndex ? 'block' : 'none'; 
                            CCLeft.appendChild(img);
                        });
                        prevButton.style.display = currentPhotoIndex === 0 ? "none" : "flex";
                        nextButton.style.display = currentPhotoIndex === photos.length - 1 ? "none" : "flex";
                        Commentbtncont.style.justifyContent = photos.length > 1 ? (currentPhotoIndex === 1 ? "space-between" : (currentPhotoIndex === photos.length - 1 ? "flex-start" : "end")) : "space-between";

                        nextButton.addEventListener('click', showNextPhoto);
                        prevButton.addEventListener('click', showPrevPhoto);
                    } else {
                        nextButton.style.display = "none";
                        prevButton.style.display = "none";
                    }

                    let account = response.accountInfo;
                    PostFullName.innerHTML = account.firstname + " " + account.lastname;
                    PostProfilePic.src = account.profile_photo;

                    PostCaption.innerHTML = response.post.caption;
                }
            } else {
                console.error('Request failed. Returned status of ' + xhr.status);
            }
        }
    };
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17


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
<<<<<<< HEAD
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

=======

    xhr.send();
}
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
