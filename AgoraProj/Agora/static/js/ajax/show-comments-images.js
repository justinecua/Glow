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
    let PostDate = document.querySelector('.Post-Date');
    let PostProfilePic = document.querySelector('.Post-ProfilePic');
    let PostCaption = document.querySelector('.Post-Caption');
    let Commentbtncont = document.querySelector('.Comment-btn-cont');
    let CaptionContent = document.querySelector('.Caption-Content');
    let CommentsSection = document.querySelector('.Comments-Section');
    let commentContainer = document.querySelectorAll('.Comment-Container');
    let CommentsTitle = document.querySelector('.CommentsTitle');
    let CTCounts = document.querySelector('.CT-Counts');
    let CCRTLeft = document.querySelector('.CCRT-Left');
    let photos = [];


    //Necessary to clear previous comments in the commentContainer
    commentContainer.forEach(comments => {
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
                let existingNoImage = CCLeft.querySelector('.NoImage');
                let existingNoImageText = CCLeft.querySelector('.NoImageText');
                if (existingNoImage) {
                    CCLeft.removeChild(existingNoImage);
                }
                if (existingNoImageText) {
                    CCLeft.removeChild(existingNoImageText);
                }

                let NoImage = document.createElement('img');
                NoImage.className = "NoImage";
                NoImage.src = "https://ik.imagekit.io/b9bdd5j68/thinking-39.png";

                CCLeft.style.width = "60%";
                CCLeft.style.height = "60%";

                let NoImageText = document.createElement('span');
                NoImageText.innerHTML = "No images found";
                NoImageText.className = "NoImageText";
                CCLeft.appendChild(NoImage);
                CCLeft.appendChild(NoImageText);
                nextButton.style.display = "none";
                prevButton.style.display = "none";
                CCRight1.style.borderRadius = "10px";
            }

            let account = result.accountInfo;
            let postInfo = result.post;
            let aTag = document.createElement('a');

            PostFullName.innerHTML = account.firstname + " " + account.lastname;
            PostDate.innerHTML = postInfo.dateTime;

            if (document.getElementById('currentUserId')) {
                let LoggedinID = currentUserId.getAttribute('data-userId');
                if (account.id == LoggedinID) {
                    aTag.href = "myprofile/" + account.id;
                    aTag.appendChild(PostProfilePic);
                    CCRTLeft.appendChild(aTag);
                }
                else {
                    aTag.href = "profile/" + account.id;
                    aTag.appendChild(PostProfilePic);
                    CCRTLeft.appendChild(aTag);
                }
            }
            else {
                aTag.href = "profile/" + account.id;
                aTag.appendChild(PostProfilePic);
                CCRTLeft.appendChild(aTag);
            }

            if (account.profile_photo.indexOf("static") !== -1) {
                PostProfilePic.src = account.profile_photo;
            }
            else {
                PostProfilePic.src = account.profile_photo + '/tr:q-100,tr:w-42,h-42';
            }

            PostCaption.innerText = result.post.caption;

            CommentsSection.innerHTML = '';
            if (result.comments.length > 0) {
                result.comments.forEach(comment => {
                    CommentsTitle.style.display = "flex";

                    var commentDiv = document.createElement('div');
                    let commentTop = document.createElement('div');
                    let commentBottom = document.createElement('div');
                    let commentProf = document.createElement('img');
                    var commentName = document.createElement('p');
                    var commentContent = document.createElement('p');
                    let commmentDate = document.createElement('p');
                    let commentOptions = document.createElement('div');
                    let commentGlow = document.createElement('p');
                    let commentReply = document.createElement('p');
                    let commentATag = document.createElement('a');
                    let totalComments = result.total_comments;

                    if (document.getElementById('currentUserId')) {
                        let LoggedinID = currentUserId.getAttribute('data-userId');
                        if (comment.id == LoggedinID) {
                            commentATag.href = "myprofile/" + comment.id;
                            commentATag.appendChild(commentProf);
                        }
                        else {
                            commentATag.href = "profile/" + comment.id;
                            commentATag.appendChild(commentProf);
                        }
                    }
                    else {
                        commentATag.href = "profile/" + comment.id;
                        commentATag.appendChild(commentProf);
                    }

                    if (comment.profile_photo.indexOf("static") !== -1) {
                        commentProf.src = comment.profile_photo;
                    }
                    else {
                        commentProf.src = comment.profile_photo + '/tr:q-100,tr:w-42,h-42';
                    }

                    commentDiv.className = "commentDiv";
                    commentName.className = "commentName";
                    commentContent.className = "commentContent";
                    commentProf.className = "commentProf";
                    commentTop.className = "commentTop";
                    commentBottom.className = "commentBottom";
                    commmentDate.className = "commentDate";
                    commentOptions.className = "commentOptions";

                    commentName.innerHTML = comment.firstname + " " + comment.lastname;
                    commentContent.innerHTML = comment.content;
                    commmentDate.innerHTML = comment.dateTime;
                    CTCounts.innerHTML = `&nbsp(${totalComments})`;
                    commentGlow.innerHTML = "glow";
                    commentReply.innerHTML = "reply";

                    commentTop.append(commentATag, commentName, commmentDate);
                    commentBottom.append(commentContent);
                    //commentOptions.append(commentGlow, commentReply);
                    commentDiv.append(commentTop, commentBottom, commentOptions);
                    CommentsSection.appendChild(commentDiv);


                });
            } else {
                CommentsTitle.style.display = "none";
            }
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

