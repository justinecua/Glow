const imageInput = document.getElementById('imageInput');
const image = document.getElementById('imageContainer');
const BrowseProfile = document.getElementById('Browse-Profile');
let CurrentimageContainer = document.getElementById('CurrentimageContainer');
let ChangeProfilecontainer = document.getElementById('ChangeProfile-container');
let ChangeProfileOverlay = document.getElementById('ChangeProfile-Overlay');
let CPBTop = document.querySelector('.CPB-Top');
let CPBBottom = document.querySelector('.CPB-Bottom');
let SaveNewProfile = document.getElementById('SaveNewProfile');
let CancelNewProfile = document.getElementById('CancelNewProfile');
let ChangeProfIcon = document.getElementById('ChangeProf-Icon');
let UserIDProfile = document.getElementById('UserIDProfile');
let ProfileValidation = document.querySelector('.Profile-Validation');
let cropper;

imageInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const isGif = file.type === 'image/gif';

    CurrentimageContainer.style.display = "none";
    CPBTop.style.display = "flex";
    CPBBottom.style.marginTop = "0";
    SaveNewProfile.style.display = "flex";
    CancelNewProfile.style.display = "none";

    let reader = new FileReader();
    reader.onload = function (event) {
      if (isGif) {
        image.src = event.target.result;
        image.style.display = 'flex';
        document.querySelector('.GIF-Note').style.display = 'flex';

        document.querySelectorAll('.CPB-Top button').forEach(button => {
          button.style.display = 'none';
        });

        if (cropper) {
          cropper.destroy();
          cropper = null;
        }
      } else {
        let img = new Image();
        img.onload = function () {
          image.src = event.target.result;
          image.style.display = 'block';
          document.querySelector('.GIF-Note').style.display = 'none';

          if (cropper) {
            cropper.destroy();
          }
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
            crop: function (event) { }
          });

          document.querySelectorAll('.CPB-Top button').forEach(button => {
            button.style.display = 'inline-block';
          });
        };
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
});


BrowseProfile.addEventListener('click', function () {
  imageInput.click();

});


SaveNewProfile.addEventListener('click', async function () {
  const button = this;
  button.disabled = true;

  const originalFile = imageInput.files[0];
  const maxFileSize = 5 * 1024 * 1024;

  if (originalFile.size > maxFileSize) {
    ProfileValidation.style.display = "flex";

    setTimeout(() => {
      ProfileValidation.style.display = "none";
      button.disabled = false;
    }, 3000);

    return;  // Exit
  }

  const isGif = originalFile.type === 'image/gif';
  if (isGif) {
    console.log('Detected GIF file. Uploading directly without cropping.');

    const UserID = UserIDProfile.getAttribute('data-UserID');
    const { sendProfile } = await import("./ajax/send-profile.js");

    sendProfile(UserID, originalFile);
    return;
  }

  if (cropper) {

    const croppedCanvas = cropper.getCroppedCanvas();

    croppedCanvas.toBlob(async function (blob) {
    if (!blob) {
      console.error('Failed to convert canvas to blob');
      return;
    }

    const croppedFile = new File([blob], originalFile.name, { type: 'image/jpeg' });
    console.log(croppedFile, 'UserID=', UserIDProfile.getAttribute('data-UserID'));

    const { sendProfile } = await import("./ajax/send-profile.js");


    sendProfile(UserIDProfile.getAttribute('data-UserID'), croppedFile);

    }, 'image/jpeg');

  }
});



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

  if (ChangeProfilecontainer && !ChangeProfilecontainer.contains(event.target)) {
    document._clickOutsideTarget = event.target;
  }
});

document.addEventListener('mouseup', function (event) {
  if (isMouseDown && ChangeProfilecontainer) {
    if (!ChangeProfilecontainer.contains(event.target) && document._clickOutsideTarget === event.target) {
      ChangeProfileOverlay.style.display = "none";
    }
    document._clickOutsideTarget = null;
  }
  isMouseDown = false;
});


CancelNewProfile.addEventListener('click', function (event) {
  event.stopPropagation();
  ChangeProfileOverlay.style.display = "none";
})

ChangeProfIcon.addEventListener('click', function (event) {
  event.stopPropagation();
  ChangeProfileOverlay.style.display = "flex";
})