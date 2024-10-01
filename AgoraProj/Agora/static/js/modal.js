
import { SendPost } from './ajax/send-post.js';
import { SendEditProfile } from './ajax/send-editprofile.js';
import { AcceptFriend } from "./ajax/accept-friend.js";
import { sendLike } from "./ajax/send-like.js";
import { sendUnlike } from "./ajax/send-unlike.js";

let Post = document.getElementById('Post-Container');
let createpost = document.getElementById('create-post');
let ImagesIcon = document.getElementById('Images-Icon');
let RemovePostImage = document.getElementById('Remove-Post-Image');
let RemovePostImage2 = document.getElementById('Remove-Post-Image2');
let RPIContainer = document.getElementById('RPI-container');
let VideoPost = document.getElementById('Video-Post');
let RemovePostVideo = document.getElementById('Remove-Post-Video');
let VideosIcon = document.getElementById('Videos-Icon');
let SizeCounter = document.getElementById('SizeCounter');
let MMTop = document.querySelector('.MM-Top');
let ModalBottom2 = document.querySelector('.Modal-Bottom2');
let MMBottom = document.querySelector('.MM-Bottom');
let EmojiIcon = document.getElementById('Emoji-Icon');
let emojiFloatingDiv = document.querySelector('.emoji-floating-div');
let UserPostBtn = document.getElementById("User-PostBtn");
let postTextarea = document.getElementById('post-textarea');
let confirmFriendObject = '';
var confirmButtons = document.querySelectorAll(".Confirm-friend");

let audienceSelect = document.getElementById('audience-select');
let audienceSelect2 = document.getElementById('audience-select2');
let Heart = document.querySelector('.Heart');
let ModalOverlay = document.getElementById('Modal-Overlay');
var customSelect = document.querySelector('.custom-select');
var selectTrigger = customSelect.querySelector('.custom-select-trigger');
var customOptions = customSelect.querySelectorAll('.custom-option');

let accountID = document.getElementById('accountID');
let accountID2 = document.getElementById('accountID2');
let ShareBtn = document.querySelectorAll('.Share-btn');
let ShareOverlay = document.getElementById('Share-Overlay');
let ShareContainer = document.getElementById('Share-Container');
let CreateBtnNav = document.getElementById('Create-Btn-Nav');
let hiddenSelect = document.getElementById('audience-select')
let Logoutbtn = document.getElementById('Logout-btn');
let LogoutOverlay = document.getElementById('Logout-Overlay');
let Logoutcontainer = document.getElementById('Logout-container');
let LCBack = document.getElementById('LC-Back');

let hasCalled = false;

Logoutbtn.addEventListener('click', async() =>{
    const { logout } = await import ("./modal/logout.js");
    logout();
})

LCBack.addEventListener('click', async() =>{
    LogoutOverlay.style.display = "none";
    document.body.style.overflowY = "auto";
})

SearchNav.addEventListener('click', async() =>{
    const { ShowSearch } = await import ("./modal/show-search.js");

    ShowSearch();
})

CreateBtnNav.addEventListener('click', async() =>{
    const { switchModal, getEmoji } = await import ("./modal/switchmodal.js");

    switchModal();
    getEmoji();
})


createpost.addEventListener('click', async() =>{
    const { switchModal, getEmoji } = await import ("./modal/switchmodal.js");

    switchModal();
    getEmoji();
})


ImagesIcon.addEventListener('click', async () => {
    const inputValue = document.getElementById("Image-Post").value;

    if (!inputValue && !hasCalled) {
        hasCalled = true;
        const { addImagePost } = await import("./modal/add-image-option.js");
        addImagePost();

    } else {
        hasCalled = false;
        RPIContainer.style.display = "flex";
        const { addImagePost } = await import("./modal/add-image-option.js");
        addImagePost();
    }
});

RemovePostImage.addEventListener('click', async() =>{
    const { removeImagePost } = await import ("./modal/remove-photo-option.js");
    removeImagePost();
})

RemovePostImage2.addEventListener('click', async() =>{
    const { removeImageSelection } = await import ("./modal/remove-image-selection.js");
    removeImageSelection();
})

/*
VideosIcon.addEventListener('click', async() =>{
    const { addVideoPost } = await import ("./modal/add-video-option.js");
    addVideoPost();
})

*/
RemovePostVideo.addEventListener('click', async() =>{
    const { removeVideoPost } = await import ("./modal/remove-video-option.js");

    removeVideoPost();
})

EmojiIcon.addEventListener('click', async() =>{
    const { ShowEmojis } = await import ("./modal/show-emoji-overlay.js");
    ShowEmojis();
});

/*
AddEmojiComment.addEventListener('click', async() =>{
    const { ShowEmojis2 } = await import ("./modal/emoji-comment.js");
    ShowEmojis2();
    console.log('asdwa');
});

*/


ShareBtn.forEach(buttonShare => {
    buttonShare.addEventListener('click', (event) => {
        event.stopPropagation();
        ShareOverlay.style.display = "flex";
        console.log("Clicked share");
    });
});

ShareContainer.addEventListener('click', function(event) {
    event.stopPropagation();
});

Logoutcontainer.addEventListener('click', function(event) {
    event.stopPropagation();
});


let ImageContainer = document.querySelector('.ImageContainer');

document.addEventListener('click', function(event) {

    if (!emojiFloatingDiv.contains(event.target)) {
        HideEmojis();
    }

    if (Post) {
        if (!Post.contains(event.target)) {
            ModalOverlay.style.display = "none";
        }
    }

    if (ImageContainer) {
        if (!ImageContainer.contains(event.target)) {
            ModalOverlay.style.display = "none";
        }
    }

    if(!ShareContainer.contains(event.target)){
        ShareOverlay.style.display = "none";
    }

    if (!customSelect.contains(event.target)) {
        customSelect.classList.remove('open');
    }

});


function HideEmojis(){
    emojiFloatingDiv.style.display = "none";
}



const { PostPhotos, getPhotos} = await import ("./modal/add-photos.js");
PostPhotos(updateTotalSize);

const { PostVideos, getVideos } = await import ("./modal/add-videos.js");
PostVideos(updateTotalSize);

const photosArray = getPhotos();
const VideosArray = getVideos();

let totalUploadedSizeBytes = 0;
let AccountID = accountID.value;
let AudienceID = audienceSelect.value;

let mediaObject = '';
let UserCaption = '';
var hashtags = [];


postTextarea.addEventListener('input', function() {
    var userCaption = postTextarea.value;
    var words = userCaption.split(' ');

    hashtags = [];
    var caption = userCaption;

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (word.startsWith('#') && !word.endsWith(' ')) {
            hashtags.push(word.slice(1));
            caption = caption.replace(word, '');
        }
    }

    updateMediaObject(caption);

});

accountID.addEventListener('change', function() {
    AccountID = accountID.value;
    updateMediaObject();
});



/*-----------------------------------Custom Audience Dropdown --------------------------------------*/


selectTrigger.addEventListener('click', function () {
    customSelect.classList.toggle('open');
});

customOptions.forEach(function (option) {
    option.addEventListener('click', function () {
        var value = this.getAttribute('data-value');
        var img = this.getAttribute('data-img');
        var text = this.textContent.trim();

        selectTrigger.querySelector('span').textContent = text;
        hiddenSelect.value = value;
        customSelect.classList.remove('open');
    });
});



if (customOptions.length > 0) {
    var firstOption = customOptions[0];
    selectTrigger.querySelector('span').textContent = firstOption.textContent.trim();
    audienceSelect.value = firstOption.getAttribute('data-value');
    audienceSelect2.value = firstOption.getAttribute('data-value');
}


/*------------------------------------------------------------------------------*/

const placeholderTexts = [
    "Enter your glowing caption here...",
    "Share your glowing thoughts...",
    "Oops, You forgot to add a glowing caption...",
    "What's on your glowing mind?",
    "Don't leave it blank! Write something glowing!"
];


let placeholderIndex = 0;

function updateMediaObject(caption) {
    if (!caption.trim() && !photosArray.length >= 1) {
        return null;
    }
    let mediaObject = {
        accID: AccountID,
        audience: hiddenSelect.value,
        photos: photosArray,
        videos: VideosArray,
        caption: caption,
        tags: hashtags,
    };

    return mediaObject;
}


UserPostBtn.addEventListener('click', async () => {
    UserPostBtn.disabled = true;
    let caption = postTextarea.value;
    caption = removeHashtags(caption);
    let mediaObject = updateMediaObject(caption);

    if (mediaObject) {
        SendPost(mediaObject);

  } else {
        postTextarea.placeholder = placeholderTexts[placeholderIndex];
        placeholderIndex = (placeholderIndex + 1) % placeholderTexts.length;
        UserPostBtn.disabled = false;
    }
});


function removeHashtags(caption) {
    const words = caption.split(' ');
    const filteredWords = words.filter(word => !word.startsWith('#'));
    const newCaption = filteredWords.join(' ');
    return newCaption;
}

function formatFileSize(bytes) {
    if (bytes < 1024) {
        return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}
function updateTotalSize(fileSize) {
    const maxSizeBytes = 25 * 1024 * 1024;

    if (totalUploadedSizeBytes + fileSize > maxSizeBytes) {
        alert('Total uploaded size cannot exceed 25 MB.');
        if (UserPostBtn) {
            UserPostBtn.disabled = true;
        }
        return false;
    }

    ModalBottom2.style.height = "7rem";
    MMBottom.style.height = "50%";
    MMTop.style.display = "flex";
    totalUploadedSizeBytes += fileSize;

    SizeCounter.innerHTML = formatFileSize(totalUploadedSizeBytes) + "&nbsp;/&nbsp;25 MB";
    console.log(`Total uploaded size: ${formatFileSize(totalUploadedSizeBytes)}`);

    return true;
}



    confirmButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            var notifId = button.getAttribute("data-notif-id");
            var friendID = button.getAttribute("friendrequestID");

            confirmFriendObject ={
                NotifId: notifId,
                friend_requestID: friendID,

            }

            AcceptFriend(confirmFriendObject);
            console.log(confirmFriendObject)
        });
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


/*-------------------------------Edit Profile ------------------------------------------*/
let EPCoverPhoto = document.querySelector('.EP-CoverPhoto');
let EPFirstname = document.getElementById('EP-Firstname');
let EPLastname = document.getElementById('EP-Lastname');
let EPUsername = document.getElementById('EP-Username');
let EPBio = document.getElementById('EP-Bio');
let EPBirthday = document.getElementById('EP-Birthday');
let SaveEditProfile = document.getElementById('Save-EditProfile');
let EditMyProfile = document.getElementById('Edit-MyProfile');
let EditProfileOverlay = document.getElementById('EditProfile-Overlay');
let EditProfileObject = '';


const { AddCoverPhoto, getCoverPhoto } = await import ("./modal/add-coverphoto.js");
const { AddProfilePhoto, getProfilePhoto } = await import ("./modal/add-profile-photo.js");

AddCoverPhoto();
AddProfilePhoto();


EPBio.addEventListener('change', function(){
    let epBio = EPBio.value;
    UpdateEditObject();
})

EPBirthday.addEventListener('change', function(){
    let epBirthday = EPBirthday.value;
    UpdateEditObject();
})

function UpdateEditObject(){
    const User_CoverPhoto = getCoverPhoto();
    const User_ProfilePhoto = getProfilePhoto();

    EditProfileObject = {
        accID: AccountID,
        firstname: EPFirstname.value,
        lastname: EPLastname.value,
        username: EPUsername.value,
        bio: EPBio.value,
        birthday: EPBirthday.value,
        cover_photo: User_CoverPhoto,
        profile_photo: User_ProfilePhoto
    }
    return EditProfileObject;
}


SaveEditProfile.addEventListener('click', function(){
    SaveEditProfile.innerHTML = "Saving..."
    UpdateEditObject();
    SendEditProfile(EditProfileObject, AccountID);
})



/*----------------------------Share-btn-Functionality----------------------------*/





/*---------------------------- WebSocket -------------------------------*/
/*
var socket = new WebSocket('ws://' + window.location.host + '/ws/activity/');


socket.onopen = function(event) {
    console.log('WebSocket connection established.');

    // Periodically send a ping to server to update activity status
    setInterval(function() {
        const activityData = {
            type: 'ping',
            user_id: 123
        };
        socket.send(JSON.stringify(activityData));
    }, 30000); // Send ping every 30 seconds
};

socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    console.log('Received message:', data);

    // Update friend's activity status based on received data
    updateFriendStatus(data.user_id, data.activity_type);
};

socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};

socket.onclose = function(event) {
    console.log('WebSocket connection closed:', event);
};

function updateFriendStatus(userId, activityType) {
    var statusElement = document.getElementById('status_' + userId);
    if (statusElement) {
        statusElement.textContent = activityType === 'active' ? 'Active' : 'Inactive';
    }
}


socket.onopen = function(event) {
    console.log('WebSocket connected');
    fetchPosts();
};

socket.onmessage = function(e) {
    var data = JSON.parse(e.data);
    updatePosts(data.posts);
}

function fetchPosts() {
    socket.send(JSON.stringify({
        'type': 'fetch.posts'
    }));
}



function updatePosts() {
    var postContainers = document.querySelectorAll('.User-Post-Container');

    postContainers.forEach(function(postContainer, index) {
        var postDateTime = postContainer.querySelector('.Post-Photo-Date-Time');
        if (posts[index] && posts[index].dateTime) {
            var postTime = new Date(posts[index].dateTime);

            var manilaTime = new Date(postTime.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));

            var currentTime = new Date();
            var timeDifference = currentTime - manilaTime;
            var timeAgo = '';

            if (timeDifference < 60000) {
                timeAgo = 'Just now';
            } else if (timeDifference < 3600000) {
                var minutes = Math.floor(timeDifference / 60000);
                timeAgo = "• " + minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
            } else if (timeDifference < 86400000) {
                var hours = Math.floor(timeDifference / 3600000);
                timeAgo = "• " +  hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
            } else if (timeDifference < 604800000) { // Less than a week
                var days = Math.floor(timeDifference / 86400000);
                timeAgo = "• " +  days + ' day' + (days > 1 ? 's' : '') + ' ago';
            } else if (timeDifference < 2592000000) { // Less than a month
                var weeks = Math.floor(timeDifference / 604800000);
                timeAgo = "• " +  weeks + ' week' + (weeks > 1 ? 's' : '') + ' ago';
            } else if (timeDifference < 31536000000) { // Less than a year
                var months = Math.floor(timeDifference / 2592000000);
                timeAgo = "• " +  months + ' month' + (months > 1 ? 's' : '') + ' ago';
            } else {
                var years = Math.floor(timeDifference / 31536000000);
                timeAgo = "• " +  years + ' year' + (years > 1 ? 's' : '') + ' ago';
            }

            postDateTime.textContent = timeAgo;
        } else {
            // Handle case where post or post dateTime is missing
        }
    });
}


updatePosts();
*/
