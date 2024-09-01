
export function AcceptFriend(confirmFriendObject){
    let UNButtons = document.querySelector('.UN-Buttons');

    var xhr = new XMLHttpRequest();

    xhr.open('POST', '/confirm_friend/'); 
    xhr.setRequestHeader("Content-Type", "application/json");

    //loadingIndicator.style.display = 'flex';

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            
          //  <loadingIndic></loadingIndic>ator.style.display = 'none';
          //  loadingIndicator.classList.remove('loading');

            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    UNButtons.style.display = "none";
                    console.log("Post successful: " + response.message);
                
                } else {
                    console.error("Post failed: " + response.message);
                }
            } else {
                console.error('Request failed. Returned status of ' + xhr.status);  
            }
        }
    };
    
    xhr.send(JSON.stringify(confirmFriendObject));
}