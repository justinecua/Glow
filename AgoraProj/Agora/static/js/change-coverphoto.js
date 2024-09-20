let ChangeCoverBtn = document.querySelector('.ChangeCover-Btn');
let ChangeCoverOverlay = document.getElementById('ChangeCover-Overlay');
let ChangeCoverContainer = document.getElementById('ChangeCover-container');
let BrowseCover = document.getElementById('Browse-Cover');
let CoverInput = document.getElementById('CoverInput');
let CurrentCoverContainer = document.getElementById('CurrentCoverContainer');
let CPBTopCover = document.querySelector('.CPB-TopCover');
let CPBBottom = document.querySelector('.CPB-Bottom');
let SaveNewCover = document.getElementById('SaveNewCover');
let CancelNewCover = document.getElementById('CancelNewCover');
let image = document.getElementById('CoverContainer');
let cropper;

ChangeCoverBtn.addEventListener('click', function(){
  ChangeCoverOverlay.style.display = "flex";
})

CoverInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    CurrentCoverContainer.style.display = "none";
    CPBTopCover.style.display = "flex";
    CPBBottom.style.marginTop = "0";
    SaveNewCover.style.display = "flex";
    CancelNewCover.style.display = "none";
    const reader = new FileReader();
    reader.onload = function (event) {
      image.src = event.target.result;
      cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        viewMode: 1,
        dragMode: 'move',
        cropBoxMovable: true,
        cropBoxResizable: true,
        movable: true,
        zoomable: true,
        ready: function () {
          centerCropBox();
        },
        crop: function (event) {

        }
      });
    };
    reader.readAsDataURL(file);
  }
});

BrowseCover.addEventListener('click', function(){
  CoverInput.click();
})

document.getElementById('resetButton').addEventListener('click', function () {
  if (cropper) {
    cropper.reset();
    centerCropBox();
  }
});

document.getElementById('rotateButton').addEventListener('click', function () {
  if (cropper) {
    cropper.rotate(45);
  }
});

document.getElementById('rotateButton2').addEventListener('click', function () {
  if (cropper) {
    cropper.rotate(-45);
  }
});

document.getElementById('zoomInButton').addEventListener('click', function () {
  if (cropper) {
    cropper.zoom(0.1);
  }
});

document.getElementById('zoomOutButton').addEventListener('click', function () {
  if (cropper) {
    cropper.zoom(-0.1);
  }
});

document.getElementById('ratio4x3').addEventListener('click', function () {
  if (cropper) {
    cropper.setAspectRatio(4 / 3);
  }
});

document.getElementById('ratio1x1').addEventListener('click', function () {
  if (cropper) {
    cropper.setAspectRatio(1 / 1);
  }
});

document.getElementById('flipHorizontal').addEventListener('click', function () {
  if (cropper) {
    cropper.scaleX(-cropper.getData().scaleX || -1);
  }
});

document.getElementById('flipVertical').addEventListener('click', function () {
  if (cropper) {
    cropper.scaleY(-cropper.getData().scaleY || -1);
  }
});

function centerCropBox() {
  if (cropper) {
    const containerData = cropper.getContainerData();
    const cropBoxData = cropper.getCropBoxData();
    const imageData = cropper.getImageData();

    const centerX = (containerData.width - cropBoxData.width) / 2;
    const centerY = (containerData.height - cropBoxData.height) / 2;

    cropper.setCropBoxData({
      left: centerX,
      top: centerY,
      width: cropBoxData.width,
      height: cropBoxData.height
    });


    cropper.setCanvasData({
      left: (containerData.width - imageData.width) / 2,
      top: (containerData.height - imageData.height) / 2
    });
  }
}


let isMouseDown = false;

document.addEventListener('mousedown', function (event) {
  isMouseDown = true;

  if (ChangeCoverContainer && !ChangeCoverContainer.contains(event.target)) {
    document._clickOutsideTarget = event.target;
  }
});

document.addEventListener('mouseup', function (event) {
  if (isMouseDown && ChangeCoverContainer) {
    if (!ChangeCoverContainer.contains(event.target) && document._clickOutsideTarget === event.target) {
      ChangeCoverOverlay.style.display = "none";
    }
    document._clickOutsideTarget = null;
  }
  isMouseDown = false;
});
