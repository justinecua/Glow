let PostOptions = document.querySelectorAll('.Post-Options');
let UserPostOptionsP = document.querySelectorAll('.UserPost-Options');

PostOptions.forEach(options => {
  options.addEventListener('click', function(event) {
    event.stopPropagation();

    UserPostOptionsP.forEach(Options => {
      Options.style.display = "none";
    });

    let postContainer = options.closest('.User-Post-Container2');
    let postId = postContainer.getAttribute('data-postid');
    let userPostOptions = postContainer.querySelector('.UserPost-Options');

    userPostOptions.style.display = "flex";
    console.log(postId);
  });
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
