let emojiFloatingDiv = document.querySelector('.emoji-floating-div2');

export function ShowEmojis2(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/emojis/');
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
              

                if (response.emoji) {
                    emojiFloatingDiv.innerHTML = response.emoji;
                    response.emoji.forEach(function (emoji_code) {
                        var emojiDiv = document.createElement('div');
                        emojiDiv.className = "Emoji-Container";

                        emojiFloatingDiv.appendChild(emojiDiv);
                        emojiFloatingDiv.style.display = "grid";
                    });
                }
            } else {
                console.error('Request failed. Returned status of ' + xhr.status);
            }
        }
    };

    xhr.send();

}