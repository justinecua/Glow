/*---------------------------- For You & Following Functionality----------------------------*/
import { fetchForYou } from "./ajax/fetch-ForYou.js";
import { fetchFriendPosts } from "./ajax/fetch-friends-posts.js";

let ForYou = document.getElementById('For-You');
let Following = document.getElementById('Following');
let NCenterContent = document.querySelector('.NCenter-content');
let NCenterContent2 = document.querySelector('.NCenter-content2');

let forYouPostsFetched = false;
let friendPostsFetched = false;

ForYou.addEventListener('click', function() {
    NCenterContent.style.display = "flex";
    NCenterContent2.style.display = "none";
    ForYou.classList.add('active');
    Following.classList.remove('active');
    if (!forYouPostsFetched) {
        fetchForYou();
        forYouPostsFetched = true;
    }
});

Following.addEventListener('click', function() {
    NCenterContent.style.display = "none";
    NCenterContent2.style.display = "flex";
    ForYou.classList.remove('active');
    Following.classList.add('active');
    if (!friendPostsFetched) {
        fetchFriendPosts();
        friendPostsFetched = true;
    }
});


fetchForYou();
ForYou.classList.add('active');
Following.classList.remove('active');
