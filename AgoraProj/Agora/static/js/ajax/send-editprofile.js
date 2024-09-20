
export function SendEditProfile(ProfileObject, id){
    var xhr = new XMLHttpRequest();
    var loadingIndicator = document.getElementById('loadingIndicator');
    let EditProfileOverlay = document.getElementById('EditProfile-Overlay');
    var fadeBox = document.getElementById('messages');
    let SaveEditProfile = document.getElementById('Save-EditProfile');

    xhr.open('POST', `/editProfile/${id}`); 
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.LOADING) {
            loadingIndicator.style.display = 'flex'
            
        }
        else if (xhr.readyState === XMLHttpRequest.DONE) {
            loadingIndicator.style.display = 'none';
            loadingIndicator.classList.remove('loading');

            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    console.log("Edit successful: " + response.message);
                    messages.innerHTML = response.message;
                    
                    EditProfileOverlay.style.display = "none";
                    SaveEditProfile.innerHTML = "Sent"

                    fadeBox.style.display = 'flex';
                    setTimeout(function () {
                        fadeBox.style.opacity = '1'; 
                        SaveEditProfile.innerHTML = "Sent";
                    }, 100)

                    setTimeout(function () {
                        fadeBox.style.opacity = '0'; 
                        SaveEditProfile.innerHTML = "Save";
                    }, 3000);
                } else {
                    console.error("Post failed: " + response.message);
                }
            } else {
                console.error('Request failed. Returned status of ' + xhr.status);  
            }
        }
    };
    
    xhr.send(JSON.stringify(ProfileObject));
}
