
export function switchModal(){
    let ModalOverlay = document.getElementById('Modal-Overlay');
    ModalOverlay.style.display = "flex";
    
}

export function getEmoji(){
    let loadingBar = document.getElementById('loadingIndicator');
    loadingBar.style.display = 'flex';

    let emojifloatingdiv = document.querySelectorAll('.emoji-floating-div');
    
    fetch('dashboard/emoji', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        return response.json();
    })
    .then(result => {
        loadingBar.style.display = 'none';

        result.emoji.forEach(emoji =>{
            emojifloatingdiv.forEach(div => {
                let emojiDiv = document.createElement('div');
                emojiDiv.className = 'Emoji-Container';
                emojiDiv.onclick =  function(){
                    insertEmoji(emoji);
                }
                emojiDiv.innerText = emoji; 
                div.appendChild(emojiDiv);
            });
        });
    })
    .catch(error => {
        loadingBar.style.display = 'none';
        console.log(error);
    });
}

function insertEmoji(emoji) {
    var textarea = document.getElementById("post-textarea");
    var cursorPos = textarea.selectionStart;
    var textBeforeCursor = textarea.value.substring(0, cursorPos);
    var textAfterCursor = textarea.value.substring(cursorPos);

    textarea.value = textBeforeCursor + emoji + textAfterCursor;
    textarea.selectionStart = textarea.selectionEnd = cursorPos + emoji.length;
    
    let Caption = textarea.value;
    return Caption;
}
