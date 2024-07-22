let CommentsSection = document.querySelector('.Comments-Section');

export function getComments(postId) {


    fetch(`/FetchComments/${postId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        return response.json();
    })
    .then(result => {
        if (result.status === "success") {
            renderComments(result.comments);
        } else {
            console.error('Failed to fetch comments');
        }
    })
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
