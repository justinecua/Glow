import { SendCommentToDB } from "./send-comment.js";
import { sendLike } from "./send-like.js";
import { sendUnlike } from "./send-unlike.js";
import { getPost } from "./show-comments-images.js";

let NCenterContent = document.querySelector('.NCenter-content2');

export function fetchFriendPosts() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', `/FetchFriendsPosts/`, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    NCenterContent.innerHTML = '';
                    response.posts.forEach(post => {


                        let postHtml = `

                            <div class="User-Post-Container">
                                <div class="UPC-content-Top">
                                    <div class="UPCCT-Left">
                                        <a href="profile/${post.account.id}">
                                            <div class="Post-Prof-Cont">
                                                <img src="${post.account.profile_photo}">
                                            </div>
                                        </a>
                                        <div class="Post-Prof-Cont2">
                                            <div id="Post-Prof-Cont-Name1" class="Post-Prof-Cont-Name">
                                                <a href="profile/${post.account.id}"><p class="Photo-Post-username">${post.account.firstname}</p></a>
                                                <p class="Post-Photo-Date-Time">${post.time_ago}</p>
                                            </div>
                                            <div class="Post-Prof-Cont-Username">
                                                <p>@${post.account.username}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="UPCCT-Right">
                                        <!-- Actions here -->
                                    </div>
                                </div>
                                <div class="UPC-content-grid ${post.photos.length === 3 ? 'three-photos' : ''}">
                                    ${post.photos.map(photo => `
                                        <div class="UPC-content ${post.photos.length === 1 ? 'single-photo' : ''}">
                                            <img src="${photo.link}?cm-pad_resize,bg-F3F3F3" alt="">
                                        </div>`).join('')}
                                </div>
                                <div class="UPC-content-Bottom">
                                    <div class="UPCB-Caption">
                                        <div class="Cap-User">
                                            <p>${post.account.firstname}</p>
                                        </div>
                                        <div class="Cap-Caption">
                                            <p class="postCaption">${post.caption}</p>
                                            <br>
                                        </div>
                                    </div>
                                    <div class="UPCB-Tags">
                                        ${post.tags.map(tag => `
                                            <a href="/tags/${tag.id}"><div><span class="hashtags">#${tag.tag}</span></div></a>
                                        `).join('')}
                                    </div>
                                    <div class="UPCB-Reacts">
                                        <div class="Reacts">
                                            <div class="GlowReact-Div" data-PostIDD="${post.id}" data-AccID="${post.account.id}">
                                                ${post.has_liked ? '<span class="ChangeGlow">&#10022;</span>' : '<img class="glow-react" src="static/images/glow4.png" alt="Glow">'}
                                            </div>
                                            <div class="React-Div Comment-Btn-Show" data-PostID="${post.id}">
                                                <img src="static/images/chat (2).png" alt="">
                                            </div>
                                        </div>
                                        <div class="React-Counts">
                                            <div class="glow-count">
                                                <p>${post.glows_count} ${post.glows_count > 1 ? 'glows' : 'glow'}</p>
                                            </div>
                                            <div class="Comments">
                                                <p>${post.comment_count} ${post.comment_count > 1 ? 'comments' : 'comment'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        NCenterContent.innerHTML += postHtml;
                    });


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
                        let CommentInput = document.getElementById('Comment-input');
                        let CommentObject = '';
                        let SendComment = document.getElementById('Send-Comment');

                        let dataPostIDForSend = '';


                        commentBtnShow.forEach(commentBtn => {
                            commentBtn.addEventListener('click', () => {
                                commentOverlay.style.display = "flex";
                                commentContainer.style.display = "flex";
                                dataPostID = commentBtn.getAttribute("data-PostID");
                                getPost(dataPostID, 0);
                                getComments(dataPostID);
                                overlayOpened = true;
                                console.log(dataPostID);

                                dataPostIDForSend = dataPostID;
                            });
                        });


                        sendComment.addEventListener('click', () => {
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

                        commentBtnShow.forEach(commentBtn => {
                            const dataPostID2 = commentBtn.getAttribute("data-PostID");
                            getComments(dataPostID2);
                        });

                    initializeButtons();


                }
            } else {
                console.error('Request failed. Returned status of ' + xhr.status);
            }
        }
    };

    xhr.send();
}