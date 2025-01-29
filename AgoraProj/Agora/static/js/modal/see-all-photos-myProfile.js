let SAPMyProfile = document.getElementById('SAP-MyProfile');
let SeeAllModalPhotoOverlay = document.getElementById('SeeAllModalPhoto-Overlay');
let modalImage = document.getElementById('modalImage');
let prevButton = document.getElementById('prevButton');
let nextButton = document.getElementById('nextButton');
let photoThumbnails = document.querySelectorAll('#photosContainer img.photo-thumbnail');
let currentIndex = 0;

SAPMyProfile.addEventListener('click', function() {
    SeeAllModalPhotoOverlay.style.display = "flex";
    currentIndex = 0;
    updateImage();
});

function updateImage() {
    photoThumbnails.forEach((thumbnail, index) => {
        if (index === currentIndex) {
            modalImage.src = thumbnail.src;
        }
    });
}

prevButton.addEventListener('click', () => {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = photoThumbnails.length - 1;
    }
    updateImage();
});

nextButton.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= photoThumbnails.length) {
        currentIndex = 0;
    }
    updateImage();
});

SeeAllModalPhotoOverlay.addEventListener('click', (event) => {
    if (event.target === SeeAllModalPhotoOverlay) {
        SeeAllModalPhotoOverlay.style.display = 'none';
    }
});

photoThumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        currentIndex = index;
        updateImage();
    });
});


