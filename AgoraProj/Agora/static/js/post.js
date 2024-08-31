
import { SendEditProfile } from './ajax/send-editprofile.js';
import { getPost } from "./ajax/show-comments-images.js";
import { SendCommentToDB } from "./ajax/send-comment.js";
import { sendLike } from "./ajax/send-like.js";
import { sendUnlike } from "./ajax/send-unlike.js";
import { getLikes } from "./ajax/get-like.js";

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


/*--------------------Like Functionality---------------------------*/

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

initializeButtons();





