import { FetchFollowing} from "./ajax/fetch-Following.js";
import { fetchFriendPosts } from "./ajax/fetch-friends-posts.js";
import { loading } from "./ajax/fetch-Following";

let ForYou = document.getElementById('For-You');
let Following = document.getElementById('Following');
let NCenterContent = document.querySelector('.NCenter-content');
let NCenterContent2 = document.querySelector('.NCenter-content2');
let Bottomloadingposts = document.getElementById('Bottom-loading-posts');

let forYouPostsFetched = false;
let friendPostsFetched = false;

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
    FetchFollowing();
    ForYou.classList.add('active');
    Following.classList.remove('active');
    ForYou.addEventListener('click', handleForYouClick);
    Following.addEventListener('click', handleFollowingClick);
    window.addEventListener('scroll', handleScroll);

});

function handleForYouClick() {
    NCenterContent.style.display = "flex";
    NCenterContent2.style.display = "none";
    ForYou.classList.add('active');
    Following.classList.remove('active');
    if (!forYouPostsFetched) {
        FetchFollowing();
        forYouPostsFetched = true;
    }
}

function handleFollowingClick() {
    NCenterContent.style.display = "none";
    NCenterContent2.style.display = "flex";
    ForYou.classList.remove('active');
    Following.classList.add('active');
    if (!friendPostsFetched) {
        fetchFriendPosts();
        friendPostsFetched = true;
    }
}

function handleScroll() {
    checkScroll();
    fetchMoreIfAllPostsInView();
}

function fetchMoreIfAllPostsInView() {
    if (!loading && allPostsInView()) {
        FetchFollowing();
    }
}

function checkScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (!loading && allPostsInView()) {
            Bottomloadingposts.style.display = "flex";
            FetchFollowing();
        }
    }
}



