
export function SendPost(mediaObject){
    var xhr = new XMLHttpRequest();
    var sendButton = document.getElementById('sendButton');
    var loader2 = document.querySelector('.loader2');
    let ModalOverlay = document.getElementById('Modal-Overlay');
    var fadeBox = document.getElementById('messages');
    let UserPostBtn = document.getElementById("User-PostBtn");

    xhr.open('POST', '/handle_media/'); 
    xhr.setRequestHeader("Content-Type", "application/json");

    loader2.style.display = 'flex';

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            
            loader2.style.display = 'none';
            UserPostBtn.disabled = false;

            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    console.log("Post successful: " + response.message);
                    messages.innerHTML = response.message;
                    
                    ModalOverlay.style.display = "none";

                    fadeBox.style.display = 'flex';
                    setTimeout(function () {
                        fadeBox.style.opacity = '1'; 
                    }, 100)

                    setTimeout(function () {
                        fadeBox.style.opacity = '0'; 
                    }, 3000);
                } else {
                    console.error("Post failed: " + response.message);
                }
            } else {
                console.error('Request failed. Returned status of ' + xhr.status);  
            }
        }
    };
    
    xhr.send(JSON.stringify(mediaObject));
}

