import { fetchForYou } from "./ajax/fetch-ForYou_guest.js";
import { fetchFriendPosts } from "./ajax/fetch-friends-posts.js";
import { loading } from "./ajax/fetch-ForYou_guest.js";


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
    fetchForYou();

    window.addEventListener('scroll', handleScroll);

});



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



