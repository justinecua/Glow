let CommentsSection = document.querySelector('.Comments-Section');

export async function getComments(postId) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/FetchCommentsAsync/${postId}/`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    renderComments(response.comments);
                } else {
                    console.error('Failed to fetch comments');
                }
            } else {
                console.error('Failed to fetch comments');
            }
        }
    };

    xhr.send();
}

function renderComments(comments) {
    CommentsSection.innerHTML = '';
    if (comments.length > 0) {
        comments.forEach(comment => {
            var commentDiv = document.createElement('div');
            commentDiv.className = "commentDiv";

            var commentContent = document.createElement('p');
            commentContent.className = "commentContent";
            commentContent.textContent = comment.content;

            var commentName = document.createElement('p');
            commentName.className = "commentName";
            commentName.textContent = comment.firstname + " " + comment.lastname;

            var commentProf = document.createElement('img');
            commentProf.className = "commentProf";
            commentProf.src = comment.profile_photo;

            var commentDivRight = document.createElement('div');
            commentDivRight.className = "commentDivRight";
            commentDivRight.appendChild(commentName);
            commentDivRight.appendChild(commentContent);

            commentDiv.appendChild(commentProf);
            commentDiv.appendChild(commentDivRight);
            CommentsSection.appendChild(commentDiv);
        });
    } else {
        var noCommentsMessage = document.createElement('p');
        noCommentsMessage.className = "noCommentsMessage";
        noCommentsMessage.style.display = "flex";
        noCommentsMessage.style.height = "3rem";
        noCommentsMessage.style.justifyContent = "center";
        noCommentsMessage.textContent = "No comments";
        CommentsSection.appendChild(noCommentsMessage);
    }
}
