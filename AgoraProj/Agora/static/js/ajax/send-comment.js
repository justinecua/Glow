
const sendCommentBtn = document.getElementById('Send-Comment');

export function SendCommentToDB(commentObject){
    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/sendComment/');
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.LOADING) {
            sendCommentBtn.innerHTML = "Sending...";
        } else if (xhr.readyState === XMLHttpRequest.DONE) {

            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);

                if (response.status === "success") {
                    document.getElementById('Comment-input').value = '';

                    sendCommentBtn.innerHTML = "Sent";
                    setTimeout(function() {
                        sendCommentBtn.innerHTML = "Send";
                    }, 1000);

                } else {
                    console.error("Post failed: " + response.message);
                }
                response.forEach(newComments => {
                    console.log(newComments.comment);
                })
            } else {
                console.error('Request failed. Returned status of ' + xhr.status);
            }
        }
    };

    xhr.send(JSON.stringify(commentObject));
}
