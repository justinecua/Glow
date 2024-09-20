let PostOptions = document.querySelectorAll('.Post-Options2');
let UserPostOptionsP = document.querySelectorAll('.UserPost-Options');
let DeletePostOverlay = document.getElementById('DeletePost-Overlay');
let EditPostOverlay = document.getElementById('EditPost-Overlay');
let CloseDeletePost = document.getElementById('Close-DeletePost');
let DPBack = document.getElementById('DP-Back');
let DPSubmit = document.querySelector('.DP-Submit');
let ChangeProfIcon = document.getElementById('ChangeProf-Icon');

let postId = null;

function handleDeletePost() {
  if (postId) {
    import("./ajax/delete-post.js")
      .then(module => {
        module.deletePost(postId);
      })
      .catch(error => console.error('Error loading delete-post.js:', error));
  }
}

PostOptions.forEach(options => {
  options.addEventListener('click', function(event) {
    event.stopPropagation();

    UserPostOptionsP.forEach(Options => {
      Options.style.display = "none";
    });

    let postContainer = options.closest('.User-Post-Container2');
    postId = postContainer.getAttribute('data-postid');
    let userPostOptions = postContainer.querySelector('.UserPost-Options');
    let PostDeleteBtn = postContainer.querySelector('.Post-DeleteBtn');
    let PostEditBtn = document.querySelector('.Post-EditBtn');

    PostDeleteBtn.addEventListener('click', function() {
      DeletePostOverlay.style.display = 'flex';
      userPostOptions.style.display = "none";
      console.log(postId);
    });

    PostEditBtn.addEventListener('click', function(){
      EditPostOverlay.style.display= "flex";
      userPostOptions.style.display = "none";
      console.log(postId);
    })

    userPostOptions.style.display = "flex";
  });
});


DPSubmit.addEventListener('click', handleDeletePost);

CloseDeletePost.addEventListener('click', function() {
  DeletePostOverlay.style.display = 'none';
});


DPBack.addEventListener('click', function() {
  DeletePostOverlay.style.display = 'none';
});


document.addEventListener('click', function(event) {
  let isClickInside = false;

  UserPostOptionsP.forEach(Options => {
    if (Options.contains(event.target)) {
      isClickInside = true;
    }
  });

  if (!isClickInside) {
    UserPostOptionsP.forEach(Options => {
      Options.style.display = "none";
    });
  }
});

