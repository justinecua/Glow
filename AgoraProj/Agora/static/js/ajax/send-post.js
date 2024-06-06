
export function SendPost(mediaObject){
    var xhr = new XMLHttpRequest();
    var sendButton = document.getElementById('sendButton');
    var loadingIndicator = document.getElementById('loadingIndicator');
    let ModalOverlay = document.getElementById('Modal-Overlay');
    var fadeBox = document.getElementById('messages');

    xhr.open('POST', '/handle_media/'); 
    xhr.setRequestHeader("Content-Type", "application/json");

    loadingIndicator.style.display = 'flex';

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            
            loadingIndicator.style.display = 'none';
            loadingIndicator.classList.remove('loading');

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
