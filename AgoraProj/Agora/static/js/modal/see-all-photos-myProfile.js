let SAPMyProfile = document.getElementById('SAP-MyProfile');
let SeeAllModalPhotoOverlay = document.getElementById('SeeAllModalPhoto-Overlay');

// Event listener for showing the modal
SAPMyProfile.addEventListener('click', function(){
    SeeAllModalPhotoOverlay.style.display = "flex";
});

// Select the modal image and navigation buttons
const modalImage = document.getElementById('modalImage');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

// Get all photo thumbnails from the DOM
const photoThumbnails = document.querySelectorAll('#photosContainer .photo-thumbnail');

// Initialize the current photo index
let currentIndex = 0;

// Function to update the displayed image
function updateImage() {
    modalImage.src = photoThumbnails[currentIndex].src;  // Update the src of the modal image
}

// Event listener for Prev button
prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = photoThumbnails.length - 1; // Loop back to the last image
    }
    updateImage();
});

// Event listener for Next button
nextButton.addEventListener('click', () => {
    if (currentIndex < photoThumbnails.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0; // Loop back to the first image
    }
    updateImage();
});

// Initially display the first image when the modal is shown
updateImage();
