const sendCommentBtn = document.getElementById('Send-Comment');
let CommentsSection = document.querySelector('.Comments-Section');
let noCommentsMessage = document.querySelector('.noCommentsMessage');
let CTCounts = document.querySelector('.CT-Counts');
let CommentsTitle = document.querySelector('.CommentsTitle');
let Comments = document.querySelector('.Comments');

export function SendCommentToDB(commentObject) {
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

                    document.getElementById('Comment-input').value = ''; // Clear input
                    sendCommentBtn.innerHTML = "Send";


                    const totalComments = response.total_comments;
                    if (totalComments > 0) {
                        CommentsTitle.style.display = "flex";
                    }
                    else{
                        CommentsTitle.style.display = "none";
                    }

                    var commentDiv = document.createElement('div');
                    let commentTop = document.createElement('div');
                    let commentBottom = document.createElement('div');
                    let commentProf = document.createElement('img');
                    var commentName = document.createElement('p');
                    var commentContent = document.createElement('p');
                    let commmentDate = document.createElement('p');
                    let commentOptions = document.createElement('div');
                    let commentGlow = document.createElement('p');
                    let commentReply = document.createElement('p');

                    if (response.profile_photo.indexOf("static") !== -1) {
                        commentProf.src = response.profile_photo;
                    } else {
                        commentProf.src = response.profile_photo + '/tr:q-100,tr:w-42,h-42';
                    }

                    commentDiv.className = "commentDiv";
                    commentName.className = "commentName";
                    commentContent.className = "commentContent";
                    commentProf.className = "commentProf";
                    commentTop.className = "commentTop";
                    commentBottom.className = "commentBottom";
                    commmentDate.className = "commentDate";
                    commentOptions.className = "commentOptions";

                    commentName.innerHTML = response.accFirstName + " " + response.accLastName;
                    commentContent.innerHTML = response.comment;
                    commmentDate.innerHTML = response.dateTime;
                    CTCounts.innerHTML = `&nbsp(${totalComments})`;
                    commentGlow.innerHTML = "glow";
                    commentReply.innerHTML = "reply";

                    commentTop.append(commentProf, commentName, commmentDate);
                    commentBottom.append(commentContent);
                    // commentOptions.append(commentGlow, commentReply);
                    commentDiv.append(commentTop, commentBottom, commentOptions);
                    CommentsSection.prepend(commentDiv);

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
