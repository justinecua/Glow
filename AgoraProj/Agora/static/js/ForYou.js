<<<<<<< HEAD
import { fetchForYou} from "./ajax/fetch-ForYou.js";
import { fetchFriendPosts } from "./ajax/fetch-friends-posts.js";
import { loading } from "./ajax/fetch-ForYou.js";
=======
/*---------------------------- For You & Following Functionality----------------------------*/
import { fetchForYou } from "./ajax/fetch-ForYou.js";
import { fetchFriendPosts } from "./ajax/fetch-friends-posts.js";
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17

let ForYou = document.getElementById('For-You');
let Following = document.getElementById('Following');
let NCenterContent = document.querySelector('.NCenter-content');
let NCenterContent2 = document.querySelector('.NCenter-content2');
<<<<<<< HEAD
let Bottomloadingposts = document.getElementById('Bottom-loading-posts');
=======
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17

let forYouPostsFetched = false;
let friendPostsFetched = false;

<<<<<<< HEAD
function allPostsInView() {
    const posts = document.querySelectorAll('.User-Post-Container');
    if (posts.length === 0) {
        return false; 
    }
    const lastPost = posts[posts.length - 1];
    const lastPostRect = lastPost.getBoundingClientRect();
    return lastPostRect.bottom <= window.innerHeight;
}

    //fetchNewPosts();
    document.addEventListener('DOMContentLoaded', function() {
        fetchForYou();
        ForYou.classList.add('active');
        Following.classList.remove('active');
        ForYou.addEventListener('click', handleForYouClick);
        Following.addEventListener('click', handleFollowingClick);
        window.addEventListener('scroll', handleScroll);

    });

function handleForYouClick() {
=======
ForYou.addEventListener('click', function() {
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
    NCenterContent.style.display = "flex";
    NCenterContent2.style.display = "none";
    ForYou.classList.add('active');
    Following.classList.remove('active');
    if (!forYouPostsFetched) {
        fetchForYou();
        forYouPostsFetched = true;
    }
<<<<<<< HEAD
}

function handleFollowingClick() {
=======
});

Following.addEventListener('click', function() {
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
    NCenterContent.style.display = "none";
    NCenterContent2.style.display = "flex";
    ForYou.classList.remove('active');
    Following.classList.add('active');
    if (!friendPostsFetched) {
        fetchFriendPosts();
        friendPostsFetched = true;
    }
<<<<<<< HEAD
}

function handleScroll() {
    checkScroll();
    fetchMoreIfAllPostsInView();
}

function fetchMoreIfAllPostsInView() {
    if (!loading && allPostsInView()) {
        fetchForYou();
    }
}

function checkScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (!loading && allPostsInView()) {
            Bottomloadingposts.style.display = "flex";
            fetchForYou();
        }
    }
}



=======
});


fetchForYou();
ForYou.classList.add('active');
Following.classList.remove('active');
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
