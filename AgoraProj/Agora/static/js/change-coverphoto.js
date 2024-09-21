let ChangeCoverBtn = document.querySelector('.ChangeCover-Btn');
let ChangeCoverOverlay = document.getElementById('ChangeCover-Overlay');
let ChangeCoverContainer = document.getElementById('ChangeCover-container');
let BrowseCover = document.getElementById('Browse-Cover');
let CoverInput = document.getElementById('CoverInput');
let CurrentCoverContainer = document.getElementById('CurrentCoverContainer');
let CPBTopCover = document.querySelector('.CPB-TopCover');
let CPBBottom = document.querySelector('.CPB-Bottom2');
let SaveNewCover = document.getElementById('SaveNewCover');
let CancelNewCover = document.getElementById('CancelNewCover');
let image = document.getElementById('CoverContainer');
let UserIDProfile = document.getElementById('UserIDProfile');
let CoverValidation = document.querySelector('.Cover-Validation');
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
      let img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxSize = 800;

        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImageURL = canvas.toDataURL('image/jpeg', 0.8);

        image.src = resizedImageURL;

        if (cropper) {
          cropper.destroy();
        }

        cropper = new Cropper(image, {
          aspectRatio: 21 / 9,
          viewMode: 1,
          dragMode: 'move',
          cropBoxMovable: true,
          cropBoxResizable: true,
          movable: true,
          zoomable: true,
          ready: function () {
            centerCropBox();
          }
        });
      };
    };

    reader.readAsDataURL(file);
  }
});


BrowseCover.addEventListener('click', function(){
  CoverInput.click();
});

SaveNewCover.addEventListener('click', async function () {
  const button = this;
  button.disabled = true;
  const originalFile = CoverInput.files[0];
  const maxFileSize = 5 * 1024 * 1024;

  if (originalFile.size > maxFileSize) {
    CoverValidation.style.display = "flex";

    setTimeout(() => {
      CoverValidation.style.display = "none";
      button.disabled = false;
    }, 3000);

    return;
  }
  if (cropper) {
    try {
      const originalFile2 = CoverInput.files[0];
      const UserID2 = UserIDProfile.getAttribute('data-UserID');

      const croppedCanvas2 = cropper.getCroppedCanvas();

      croppedCanvas2.toBlob(async function(blob) {
        if (!blob) {
          console.error('Failed to convert canvas to blob');
          button.disabled = false;
          return;
        }

        const croppedFile2 = new File([blob], originalFile2.name, { type: originalFile2.type });
        console.log(croppedFile2, 'UserID=', UserID2);

        const { sendCover } = await import ("./ajax/send-coverphoto.js");
        try {
          await sendCover(UserID2, originalFile2);
        } catch (error) {
          console.error('Error sending cover:', error);
        }
      }, 'image/jpeg', 1);
    } catch (error) {
      console.error('Error processing image:', error);
      button.disabled = false;
    }
  } else {
    button.disabled = false;
  }
});


document.getElementById('CresetButton').addEventListener('click', function () {
  if (cropper) {
    cropper.reset();
    centerCropBox();
  }
});

document.getElementById('CrotateButton').addEventListener('click', function () {
  if (cropper) {
    cropper.rotate(45);
  }
});

document.getElementById('CrotateButton2').addEventListener('click', function () {
  if (cropper) {
    cropper.rotate(-45);
  }
});

document.getElementById('CzoomInButton').addEventListener('click', function () {
  if (cropper) {
    cropper.zoom(0.1);
  }
});

document.getElementById('CzoomOutButton').addEventListener('click', function () {
  if (cropper) {
    cropper.zoom(-0.1);
  }
});

document.getElementById('Cratio16x9').addEventListener('click', function () {
  if (cropper) {
    cropper.setAspectRatio(16 / 9);
  }
});

document.getElementById('Cratio21x9').addEventListener('click', function () {
  if (cropper) {
    cropper.setAspectRatio(21 / 9);
  }
});

document.getElementById('CflipHorizontal').addEventListener('click', function () {
  if (cropper) {
    cropper.scaleX(-cropper.getData().scaleX || -1);
  }
});

document.getElementById('CflipVertical').addEventListener('click', function () {
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
  event.stopPropagation();
  isMouseDown = true;

  if (ChangeCoverContainer && !ChangeCoverContainer.contains(event.target)) {
    document._clickOutsideTarget = event.target;
  }
});

document.addEventListener('mouseup', function (event) {
  event.stopPropagation();
  if (isMouseDown && ChangeCoverContainer) {
    if (!ChangeCoverContainer.contains(event.target) && document._clickOutsideTarget === event.target) {
      ChangeCoverOverlay.style.display = "none";
    }
    document._clickOutsideTarget = null;
  }
  isMouseDown = false;
});

ChangeCoverOverlay.addEventListener('click', function(event) {
  if (!ChangeCoverContainer.contains(event.target)) {
    ChangeCoverOverlay.style.display = "none";
  }
});