
export function AddFriend(FriendRequest){
    var xhr = new XMLHttpRequest();
    let CancelReqFriendBtn = document.getElementById('Cancel-ReqFriend-Btn');
    var loadingIndicator2 = document.getElementById('loadingIndicator2');
    let AddFriendBtn = document.getElementById('Add-Friend-Btn');

    xhr.open('POST', '/add_friend/'); 
    xhr.setRequestHeader("Content-Type", "application/json");

    loadingIndicator2.style.display = 'flex';

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            
            loadingIndicator2.style.display = 'none';

            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    console.log("Post successful: " + response.message);
                    
                    AddFriendBtn.style.display = "none";
                    CancelReqFriendBtn.style.display = "block";
                
                } else {
                    console.error("Post failed: " + response.message);
                }
            } else {
                console.error('Request failed. Returned status of ' + xhr.status);  
            }
        }
    };
    
    xhr.send(JSON.stringify(FriendRequest));
}
