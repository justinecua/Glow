
export function FetchToDashboard(){
    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/confirm_friend/'); 
    xhr.setRequestHeader("Content-Type", "application/json");

    //loadingIndicator.style.display = 'flex';

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            
          //  <loadingIndic></loadingIndic>ator.style.display = 'none';
          //  loadingIndicator.classList.remove('loading');

            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
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