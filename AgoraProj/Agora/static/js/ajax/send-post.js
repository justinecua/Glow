
import { SendCommentToDB } from "./send-comment.js";
import { sendLike } from "./send-like.js";
import { sendUnlike } from "./send-unlike.js";
import { getPost } from "./show-comments-images.js";

export function SendPost(mediaObject){
    var xhr = new XMLHttpRequest();
    var sendButton = document.getElementById('sendButton');
    var loader2 = document.querySelector('.loader2');
    let ModalOverlay = document.getElementById('Modal-Overlay');
    var fadeBox = document.getElementById('messages');
    let UserPostBtn = document.getElementById("User-PostBtn");
    let NewPostId = document.getElementById("NewPost_Id");
    let noCommentsMessage = document.querySelector('.noCommentsMessage');

    xhr.open('POST', '/handle_media/');
    xhr.setRequestHeader("Content-Type", "application/json");

    loader2.style.display = 'flex';

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {

            loader2.style.display = 'none';
            UserPostBtn.disabled = false;

            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    fadeBox.innerHTML = response.message;

                    createAndAppendPost(response);
                    ModalOverlay.style.display = "none";

                    fadeBox.style.display = 'flex';
                    setTimeout(function () {
                        fadeBox.style.opacity = '1';
                    }, 100)

                    setTimeout(function () {
                        fadeBox.style.opacity = '0';
                    }, 3000);

                    initializeButtons();
                    const commentOverlay = document.getElementById('Comment-Overlay');
                    const commentBtnShow = document.querySelectorAll('.Comment-Btn-Show');
                    const commentContainer = document.querySelector('.Comment-Container');
                    const closeComment = document.querySelector('.Close-Comment');
                    const ccLeftImages = document.querySelector('.CC-Left-Images');
                    let dataPostID = '';
                    let overlayOpened = false;
                    const postProfilePic = document.querySelector('.Post-ProfilePic');
                    const postFullName = document.querySelector('.Post-FullName');
                    const postCaption = document.querySelector('.Post-Caption');
                    const commentInput = document.getElementById('Comment-input');
                    const sendComment = document.getElementById('Send-Comment');
                    const sendComment2 = document.getElementById('Send-Comment2');
                    let CommentObject = '';
                    let dataPostIDForSend = '';

                    commentBtnShow.forEach(commentBtn => {
                        commentBtn.addEventListener('click', () => {
                            commentOverlay.style.display = "flex";
                            commentContainer.style.display = "flex";
                            dataPostID = commentBtn.getAttribute("data-PostID");
                            getPost(dataPostID, 0);

                            overlayOpened = true;
                            dataPostIDForSend = dataPostID;
                        });
                    });
                    let accountID = document.getElementById('accountID');
                    let AccountID = accountID.value;

                    function updateComment(comment) {
                        CommentObject = {
                            accID: AccountID,
                            postID: dataPostID,
                            comment: comment
                        };
                        console.log(CommentObject);
                        return CommentObject;
                    }
                    sendComment.style.display = "none";
                    sendComment2.style.display = "flex";
                    sendComment2.addEventListener('click', () => {
                        SendCommentToDB(CommentObject, dataPostIDForSend);
                    });

                    closeComment.addEventListener('click', () => {
                        commentOverlay.style.display = "none";
                        commentContainer.style.display = "none";
                        overlayOpened = false;
                        ccLeftImages.innerHTML = '';
                    });

                    commentInput.addEventListener('change', (event) => {
                        const newComment = event.target.value;
                        updateComment(newComment);
                    });



                } else {
                    console.error("Post failed: " + response.message);
                }
            } else {
                console.error('Request failed. Returned status of ' + xhr.status);
            }
        }
    };

    xhr.send(JSON.stringify(mediaObject));
}


function createAndAppendPost(response) {
        let NCenterContent = document.querySelector('.NCenter-content');
        let postContainer = document.createElement('div');
        postContainer.classList.add('MUser-Post-Container');

        let DynamicProf = response.profile_photo ? response.profile_photo : '../static/images/default-avatar-profile-picture-male-icon.png';

        postContainer.innerHTML = `
            <div class="User-Post-Container">
                <div class="UPC-content-Top">
                    <div class="UPCCT-Left">
                        <a href="profile/${response.accId}">
                            <div class="Post-Prof-Cont">
                                <img src="${DynamicProf}">
                            </div>
                        </a>
                        <div class="Post-Prof-Cont2">
                            <div id="Post-Prof-Cont-Name1" class="Post-Prof-Cont-Name">
                                <a href="profile/${response.accId}"><p class="Photo-Post-username">${response.firstname}</p></a>
                                <p class="Post-Photo-Date-Time">${response.time}</p>
                            </div>
                            <div class="Post-Prof-Cont-Username">
                                <p>@${response.username}</p>
                            </div>
                        </div>
                    </div>
                    <div class="UPCCT-Right">

                    </div>
                </div>
                <div class="UPC-content-grid ${response.photos.length >=2 ? 'three-photos' : ''}" style="${response.photos.length === 0 ? 'display: none;' : ''}">
                    ${response.photos.map(photo =>
                        `<div class="UPC-content ${response.photos.length === 1 ? 'single-photo' : ''}">
                            <img class="lazy" src="${photo.link}/tr:q-90,tr:w-450,bl-30,q-90,h-450" data-src="${photo.link}/tr:q-90,tr:w-450,h-450">
                        </div>`).join('')}
                </div>
                <div class="UPC-content-Bottom">
                    <div class="UPCB-Caption">

                    </div>
                    <div class="UPCB-Tags">
                        ${response.tags && response.tags.map(tag => `
                            <a href="/tags/${tag.id}"><div><span class="hashtags">#${tag.tag}</span></div></a>
                        `).join('')}
                    </div>
                    <div class="UPCB-Reacts">
                        <div class="Reacts">
                            <div class="GlowReact-Div" data-PostIDD="${response.post_id}" data-AccID="${response.accId}">
                                ${response.has_liked ? '<span class="ChangeGlow">&#10022;</span>' : '<img class="glow-react" src="static/images/glow4.png" alt="Glow">'}
                            </div>
                            <div class="React-Div Comment-Btn-Show" data-PostID="${response.post_id}">
                                <img src="static/images/chat (2).png" alt="">
                            </div>
                        </div>
                        <div class="React-Counts">
                            <div class="glow-count">
                                <p>${response.glows_count} ${response.glows_count > 1 ? 'glows' : 'glow'}</p>
                            </div>
                            <div class="Comments">
                                <p>${response.comment_count} ${response.comment_count > 1 ? 'comments' : 'comment'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        console.log(response.post_id)
        NCenterContent.insertBefore(postContainer, NCenterContent.firstChild);

        let CapCaption = document.createElement('div');
        let postCaption = document.createElement('p');
        let UPCBCaption = postContainer.querySelector('.UPCB-Caption');

        postCaption.innerText = response.caption;
        postCaption.className = "postCaption";
        CapCaption.className = "Cap-Caption";
        CapCaption.appendChild(postCaption);
        UPCBCaption.append(CapCaption);

        LazyLoading(".lazy");
};




function initializeButtons() {
    let glowReactButtons = document.querySelectorAll('.glow-react');
    let changeGlowButtons = document.querySelectorAll('.ChangeGlow');

    glowReactButtons.forEach(glow_button => {
        glow_button.addEventListener('click', function() {
            handleLike(glow_button);
        });
    });

    changeGlowButtons.forEach(changeGlow => {
        changeGlow.addEventListener('click', function() {
            handleUnlike(changeGlow);
        });
    });
}


function handleLike(glow_button) {
    const parentDiv = glow_button.parentNode;
    const dataPost_ID = parentDiv.getAttribute("data-PostIDD");
    const dataAcc_ID = parentDiv.getAttribute("data-AccID");

    glow_button.style.display = "none";
    let ChangeGlow = parentDiv.querySelector('.ChangeGlow');

    if (!ChangeGlow) {
        ChangeGlow = document.createElement('span');
        ChangeGlow.className = "ChangeGlow";
        ChangeGlow.innerHTML = "&#10022;";
        ChangeGlow.style.width = "2.5rem";
        ChangeGlow.style.height = "2.4rem";
        ChangeGlow.style.userSelect = "none";
        parentDiv.appendChild(ChangeGlow);
        ChangeGlow.addEventListener('click', function() {
            handleUnlike(ChangeGlow);
        });
    } else {
        ChangeGlow.style.display = "inline";
    }

    let LikeObject = {
        accID: dataAcc_ID,
        postID: dataPost_ID,
    };

    sendLike(LikeObject, dataPost_ID);
    console.log("Like");

    ChangeGlow.classList.add('animate-heart');
}

function handleUnlike(changeGlow) {
    const parentDiv = changeGlow.parentNode;
    const dataPost_ID = parentDiv.getAttribute("data-PostIDD");

    changeGlow.style.display = "none";
    let glowButton = parentDiv.querySelector('.glow-react');
    if (!glowButton) {
        glowButton = document.createElement('img');
        glowButton.className = "glow-react";
        glowButton.src = "static/images/glow4.png";
        glowButton.alt = "Glow";
        parentDiv.appendChild(glowButton);
        glowButton.addEventListener('click', function() {
            handleLike(glowButton);
        });
    } else {
        glowButton.style.display = "block";
    }

    let LikeObject = {
        postID: dataPost_ID,
    };

    sendUnlike(LikeObject, dataPost_ID);
    console.log("Unlike");
    console.log(dataPost_ID);
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

