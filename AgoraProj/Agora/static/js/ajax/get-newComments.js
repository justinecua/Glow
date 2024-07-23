let CommentsSection = document.querySelector('.Comments-Section');

export function getComments(postId) {


    fetch(`/FetchComments/${postId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
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

}
