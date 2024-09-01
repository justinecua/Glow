

import { AcceptFriend } from "./ajax/accept-friend.js";
import { getPost } from "./ajax/show-comments-images.js";
import { SendCommentToDB } from "./ajax/send-comment.js";
import { getComments } from "./ajax/get-newComments.js";

let accountID = document.getElementById('accountID');
let audienceSelect = document.getElementById('audience-select');
let ModalOverlay = document.getElementById('Modal-Overlay');
let Heart = document.querySelector('.Heart');

    let confirmFriendObject = '';
    var confirmButtons = document.querySelectorAll(".Confirm-friend");

    confirmButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            var manilaTime = updateManilaTime();
            var notifId = button.getAttribute("data-notif-id");
            var friendID = button.getAttribute("friendrequestID");

            confirmFriendObject ={
                NotifId: notifId,
                friend_requestID: friendID,
                dateTime: manilaTime,
            }

            AcceptFriend(confirmFriendObject);
            console.log(confirmFriendObject)
        });
    });

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
let glowReact = document.querySelectorAll('.glow-react');

glowReact.forEach(function(glow_button) {
    glow_button.addEventListener('click', function() {
        const dataPostID = glow_button.parentNode.getAttribute("data-PostIDD");
        glow_button.style.display = "none";
        let ChangeGlow = document.createElement('span');
        ChangeGlow.className = "ChangeGlow";
        ChangeGlow.innerHTML = "&#10022;";
        ChangeGlow.style.width = "2.5rem";
        ChangeGlow.style.height = "2.4rem";
        ChangeGlow.style.marginTop = "-4%";
        ChangeGlow.style.userSelect = "none";

        glow_button.parentNode.appendChild(ChangeGlow);


        ChangeGlow.classList.add('animate-heart');

        console.log("Like");
        console.log(dataPostID);
        ChangeGlow.addEventListener('click', function() {
            ChangeGlow.style.display = "none";
            let glowimage = glow_button.parentNode.querySelector('.glow-react');
            if (!glowimage) {
                glowimage = document.createElement('img');
                glowimage.className = "glow-react";
                glowimage.src = "static/images/glow4.png";
                glowimage.alt = "Glow";
                glow_button.parentNode.appendChild(glowimage);
                // Trigger the animation
                glowimage.offsetWidth = glowimage.offsetWidth;
            } else {
                glowimage.style.display = "block";
                const dataPostID = glow_button.parentNode.getAttribute("data-PostIDD");
                console.log("Unlike");
                console.log(dataPostID);
            }
        });
    });
});