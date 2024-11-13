import { SendCommentToDB } from "./send-comment.js";
import { getPost } from "./show-comments-images.js";

let NCenterContent = document.querySelector('.NCenter-content');
let PostContainer = document.querySelector('.Post-Container');
let CenterTop3 = document.querySelector('.Center-Top3');
let CenterTop2 = document.querySelector('.Center-Top2');
let Bottomloadingposts = document.getElementById('Bottom-loading-posts');
let fetchedPostIds = new Set();
export let loading = false;

let page = 1;
let isGettingPost = false;

function displayLoading() {
    CenterTop3.style.display = "flex";
}

function hideLoading() {
    CenterTop3.style.display = "none";
}

export function fetchForYou() {

    if (loading) return;
    loading = true;
    displayLoading();
    fetch(`/FetchForYou/?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }

    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        hideLoading();
        return response.json();
    })
    .then(response => {
        loading = false;
        CenterTop3.style.display = "none";

        if (response.status === "success") {
            if (response.posts.length === 0) {
                console.log("No more posts to load");
                loading = true;
                return;
            }

            response.posts.forEach(post => {
                if (!fetchedPostIds.has(post.id)) {
                    let postElement = createPostElement(post);
                    NCenterContent.appendChild(postElement);
                    fetchedPostIds.add(post.id);
                }
            });
            page++;

            let GlowReactDiv2 = document.querySelectorAll('.GlowReact-Div2');
            let NotLoggedInOverlay = document.getElementById('NotLoggedIn-Overlay');
            let NotLoggedIn_btn = document.getElementById('NotLoggedIn-btn');

            GlowReactDiv2.forEach(glowBtn =>{
                glowBtn.addEventListener('click', function(event){
                    NotLoggedInOverlay.style.display = "flex";
                })
            })

            NotLoggedIn_btn.addEventListener('click', function(){
                NotLoggedInOverlay.style.display = "none";
            })

            const commentOverlay = document.getElementById('Comment-Overlay');
            const commentBtnShow = document.querySelectorAll('.Comment-Btn-Show');
            const commentContainer = document.querySelector('.Comment-Container');
            const closeComment = document.querySelector('.Close-Comment');
            const ccLeftImages = document.querySelector('.CC-Left-Images');
            let dataPostID = '';
            let overlayOpened = false;
            const postProfilePic = document.querySelector('.Post-ProfilePic');
            const postFullName = document.querySelector('.Post-FullName');
            const CCRMain1 = document.querySelectorAll('.CCR-Main1');
            const postCaption = document.querySelector('.Post-Caption');
            const commentInput = document.getElementById('Comment-input');
            const sendComment = document.getElementById('Send-Comment');

            let CommentObject = '';
            let SendComment = document.getElementById('Send-Comment');

            let dataPostIDForSend = '';
            let scrollTop = 0;

            commentBtnShow.forEach(commentBtn => {
                commentBtn.addEventListener('click', () => {
                    if (isGettingPost) return; // Prevent multiple calls
                    isGettingPost = true;

                    document.body.style.overflowY = "hidden";
                    commentOverlay.style.display = "flex";
                    commentContainer.style.display = "flex";
                    dataPostID = commentBtn.getAttribute("data-PostID");
                    getPost(dataPostID, 0);

                    overlayOpened = true;
                    dataPostIDForSend = dataPostID;
                });
            });

            closeComment.addEventListener('click', () => {
                document.body.style.overflowY = "auto";
                commentOverlay.style.display = "none";
                commentContainer.style.display = "none";
                overlayOpened = false;
                ccLeftImages.innerHTML = '';
                isGettingPost = false;
                postCaption.innerHTML = '';

            });

        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    })
    .finally(() => {
        loading = false;
        hideLoading();
        Bottomloadingposts.style.display = "none";
    });
}

function createPostElement(post) {
    let postContainer = document.createElement('div');
    let UPCcontentgrid = document.querySelector('.UPC-content-grid');
    postContainer.classList.add('MUser-Post-Container');

    let DynamicProf;

    if(post.account.profile_photo.indexOf("static") !== -1){
        DynamicProf = post.account.profile_photo;
    }
    else{
        DynamicProf = post.account.profile_photo + "/tr:w-42,h-42";
    }

    postContainer.innerHTML =
    `<div class="User-Post-Container">
        <div class="UPC-content-Top">
            <div class="UPCCT-Left">
                <a href="profile/${post.account.id}">
                    <div class="Post-Prof-Cont">
                        <img src="${ DynamicProf }">
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
            </div>
        </div>
         <div class="UPC-content-grid ${post.photos.length >=2 ? 'three-photos' : ''}" style="${post.photos.length === 0 ? 'display: none;' : ''}">
            ${post.photos.map(photo =>
                `<div class="UPC-content ${post.photos.length === 1 ? 'single-photo' : ''}">
                    <img class="lazy" src="${photo.link}/tr:q-90,tr:w-450,bl-30,q-90,h-450" data-src="${photo.link}/tr:q-90,tr:w-450,h-450">
                </div>`).join('')}
        </div>
        <div class="UPC-content-Bottom">
            <div class="UPCB-Caption">
            </div>
            <div class="UPCB-Tags">
                ${post.tags.map(tag =>
                    `<a href="/tags/${tag.id}"><div><span class="hashtags">#${tag.tag}</span></div></a>`
                ).join('')}
            </div>
            <div class="UPCB-Reacts">
                <div class="Reacts">
                    <div class="GlowReact-Div2" data-PostIDD="${post.id}" data-AccID="${post.account.id}">
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

    let CapCaption = document.createElement('div');
    let postCaption = document.createElement('p');
    let ReadMore = document.createElement('span');
    let UPCBCaption = postContainer.querySelector('.UPCB-Caption');

    postCaption.className = "postCaption";
    CapCaption.className = "Cap-Caption";
    ReadMore.className = "ReadMore";
    ReadMore.innerText = "Read More";

    function toggleText() {
        if (ReadMore.innerText === "Read More") {
            postCaption.innerText = post.caption;
            ReadMore.innerText = " Read Less";
        } else {
            postCaption.innerText = post.caption.slice(0, 400) + "...";
            ReadMore.innerText = "Read More";
        }
        postCaption.appendChild(ReadMore);
        postContainer.scrollIntoView({ behavior: 'auto', block: 'start' });
    }

    if (post.caption.length > 400) {
        postCaption.innerText = post.caption.slice(0, 400) + "...";
        postCaption.appendChild(ReadMore);
    } else {
        postCaption.innerText = post.caption;
    }

    CapCaption.appendChild(postCaption);
    UPCBCaption.appendChild(CapCaption);

    ReadMore.addEventListener('click', toggleText);

    LazyLoading(".lazy");
    return postContainer;
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
