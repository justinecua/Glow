
const sendCommentBtn = document.getElementById('Send-Comment');
let CommentsSection = document.querySelector('.Comments-Section');
let noCommentsMessage = document.querySelector('.noCommentsMessage');

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
                    console.log("comment successful: " + response);

                    noCommentsMessage.style.display = "none";
                    let commentDiv = document.createElement('div');
                    let commentProf = document.createElement('img');
                    let commentDivRight = document.createElement('commentDivRight');
                    let commentName = document.createElement('p');
                    let commentContent = document.createElement('commentContent');

                    commentDiv.classList.add('commentDiv');
                    commentProf.classList.add('commentProf');
                    commentDivRight.classList.add('commentDivRight');
                    commentName.classList.add('commentName');
                    commentContent.classList.add('commentContent');

                    commentProf.src = response.profile_photo;
                    commentName.innerHTML = response.accFirstName + response.accLastName;
                    commentContent.innerHTML = response.comment;

                    commentDivRight.append(commentName, commentContent);
                    commentDiv.append(commentProf, commentDivRight);
                    CommentsSection.append(commentDiv);

                    document.getElementById('Comment-input').value = '';

                    sendCommentBtn.innerHTML = "Send";

                } else {
                    console.error("Post failed: " + response.message);
                }

            } else {
                console.error('Request failed. Returned status of ' + xhr.status);
            }
        }
    };

    xhr.send(JSON.stringify(commentObject));
}
