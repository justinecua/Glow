export function getLikes(postId) {
    let Glows = document.querySelectorAll('.glow-count');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/getLikes/${postId}/`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    Glows.forEach(glow => {
                        if (postId == response.post_id) {
                            let glowCount = document.createElement('p');
                            glowCount.textContent = response.glow_count;
                            glow.innerHTML = ""; 
                            glow.appendChild(glowCount);
                        }
                    });
                }
            }
        }
    };

    xhr.send();
}
