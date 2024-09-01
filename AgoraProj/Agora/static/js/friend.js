

let createPost = document.getElementById('create-post');
let user_ID = document.getElementById('user_ID');
let visited_profile_ID = document.getElementById('visited_profile_ID');
let currentTimeProf = document.getElementById('currentTime-Prof'); 
let AddFriendBtn = document.getElementById('Add-Friend-Btn');
let FriendRequest = ''; 

function updateManilaTime() {
    var manilaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"});
    return manilaTime;
}
var CurrenTimeProf = updateManilaTime();
currentTimeProf.value = CurrenTimeProf;

function UpdateObject(){
    let user = user_ID.value;
    let friend = visited_profile_ID.value;
    let dateToday = currentTimeProf.value;

    FriendRequest = {
        user: user,
        friend: friend,
        date: dateToday,
    };

    return FriendRequest;
}

    if(AddFriendBtn){
        AddFriendBtn.addEventListener('click', async () => {
            const { AddFriend } = await import ("./ajax/add-friend.js");     
            UpdateObject();
    
            AddFriend(FriendRequest);
            console.log(UpdateObject());
        });
    }


    
    /* --------------------------- Search Functionality ------------------------------*/
    let GlobalSearch = document.getElementById('GlobalSearch');
    let SearchResultsContainer = document.querySelector('.Search-Results-Container');
    let ClearButton = document.getElementById('ClearButton');
    
    import { SearchResults } from './ajax/search.js';
    
    GlobalSearch.addEventListener('input', function(){
        let searchInfo = GlobalSearch.value;
        if(GlobalSearch.value.length >= 2){
            SearchResultsContainer.style.display = "flex";
            ClearButton.style.display = "flex";
            SearchResults(searchInfo); 
        }
        else{
            SearchResultsContainer.style.display = "none";
            ClearButton.style.display = "none";
            SearchResultsContainer.innerHTML = '';
        }
    });
    
    ClearButton.addEventListener('click', function(){
        GlobalSearch.value = ''; 
        SearchResultsContainer.style.display = "none"; 
        ClearButton.style.display = "none";
        SearchResultsContainer.innerHTML = '';
    });
    
    
    