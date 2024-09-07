let audienceSelect = document.getElementById('audience-select');
var customSelect = document.querySelector('.custom-select');
var selectTrigger = customSelect.querySelector('.custom-select-trigger');
var customOptions = customSelect.querySelectorAll('.custom-option');

let ImagesIcon = document.getElementById('Images-Icon');
let RemovePostImage = document.getElementById('Remove-Post-Image');
let RemovePostImage2 = document.getElementById('Remove-Post-Image2');
let RPIContainer = document.getElementById('RPI-container');
let VideoPost = document.getElementById('Video-Post');
let RemovePostVideo = document.getElementById('Remove-Post-Video');
let VideosIcon = document.getElementById('Videos-Icon');
let SizeCounter = document.getElementById('SizeCounter');
let EmojiIcon = document.getElementById('Emoji-Icon');
let emojiFloatingDiv = document.querySelector('.emoji-floating-div');
let hasCalled = false;
let postTextarea = document.getElementById('post-textarea');
let accountID = document.getElementById('accountID');
let ModalBottom3 = document.querySelector('.Modal-Bottom3');
let MMBottom4 = document.querySelector('.MM-Bottom4');
let MMTop = document.querySelectorAll('.MM-Top');

/*-----------------------------------Custom Audience Dropdown --------------------------------------*/


selectTrigger.addEventListener('click', function () {
  customSelect.classList.toggle('open');
});

customOptions.forEach(function (option) {
  option.addEventListener('click', function () {
      var value = this.getAttribute('data-value');
      var img = this.getAttribute('data-img');
      var text = this.textContent.trim();

      selectTrigger.querySelector('span').textContent = text;
      hiddenSelect.value = value;
      customSelect.classList.remove('open');
  });
});

if (customOptions.length > 0) {
  var firstOption = customOptions[0];
  selectTrigger.querySelector('span').textContent = firstOption.textContent.trim();
  audienceSelect.value = firstOption.getAttribute('data-value');
}

document.addEventListener('click', function(event) {
  if (!emojiFloatingDiv.contains(event.target)) {
    HideEmojis();
  }

  if (!customSelect.contains(event.target)) {
      customSelect.classList.remove('open');
  }
});

ImagesIcon.addEventListener('click', async () => {
  const inputValue = document.getElementById("Image-Post").value;

  if (!inputValue && !hasCalled) {
      hasCalled = true;
      const { addImagePost } = await import("./modal/add-image-option.js");
      addImagePost();

  } else {
      hasCalled = false;
      RPIContainer.style.display = "flex";
      const { addImagePost } = await import("./modal/add-image-option.js");
      addImagePost();
  }
});

RemovePostImage.addEventListener('click', async() =>{
  const { removeImagePost } = await import ("./modal/remove-photo-option.js");
  removeImagePost();
})

RemovePostImage2.addEventListener('click', async() =>{
  const { removeImageSelection } = await import ("./modal/remove-image-selection.js");
  removeImageSelection();
})

RemovePostVideo.addEventListener('click', async() =>{
  const { removeVideoPost } = await import ("./modal/remove-video-option.js");

  removeVideoPost();
})

EmojiIcon.addEventListener('click', async() =>{
  const { ShowEmojis } = await import ("./modal/show-emoji-overlay.js");
  ShowEmojis();
});



function HideEmojis(){
  emojiFloatingDiv.style.display = "none";
}


const { PostPhotos, getPhotos} = await import ("./modal/add-photos.js");
PostPhotos(updateTotalSize);

const { PostVideos, getVideos } = await import ("./modal/add-videos.js");
PostVideos(updateTotalSize);

const photosArray = getPhotos();
const VideosArray = getVideos();

let totalUploadedSizeBytes = 0;
let AccountID = accountID.value;
let AudienceID = audienceSelect.value;

let mediaObject = '';
let UserCaption = '';
var hashtags = [];


postTextarea.addEventListener('input', function() {
  var userCaption = postTextarea.value;
  var words = userCaption.split(' ');

  hashtags = [];
  var caption = userCaption;

  for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (word.startsWith('#') && !word.endsWith(' ')) {
          hashtags.push(word.slice(1));
          caption = caption.replace(word, '');
      }
  }

  updateMediaObject(caption);

});

accountID.addEventListener('change', function() {
  AccountID = accountID.value;
  updateMediaObject();
});

function formatFileSize(bytes) {
  if (bytes < 1024) {
      return bytes + ' bytes';
  } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
  } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}

function updateTotalSize(fileSize) {
  const maxSizeBytes = 25 * 1024 * 1024;

  if (totalUploadedSizeBytes + fileSize > maxSizeBytes) {
      alert('Total uploaded size cannot exceed 25 MB.');
      if (UserPostBtn) {
          UserPostBtn.disabled = true;
      }
      return false;
  }

  ModalBottom3.style.height = "3rem";
  MMBottom4.style.height = "100%";
  MMTop.forEach(top =>{
    top.style.display = "flex";
  })
  totalUploadedSizeBytes += fileSize;

  SizeCounter.innerHTML = formatFileSize(totalUploadedSizeBytes) + "&nbsp;/&nbsp;25 MB";
  console.log(`Total uploaded size: ${formatFileSize(totalUploadedSizeBytes)}`);

  return true;
}
