
const imageInput = document.getElementById('imageInput');
const image = document.getElementById('imageContainer');
let cropper;

imageInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      image.src = event.target.result;
      image.style.display = 'block';
      if (cropper) {
        cropper.destroy();
      }
      cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        viewMode: 1,
        dragMode: 'crop',
        crop: function (event) {

        }
      });
    };
    reader.readAsDataURL(file);
  }
})


document.getElementById('cropButton').addEventListener('click', function () {
  if (cropper) {
    const croppedCanvas = cropper.getCroppedCanvas();
    document.body.appendChild(croppedCanvas);
  }
});

document.getElementById('resetButton').addEventListener('click', function () {
  if (cropper) {
    cropper.reset();
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
    cropper.zoom(0.1); // Zoom in
  }
});

document.getElementById('zoomOutButton').addEventListener('click', function () {
  if (cropper) {
    cropper.zoom(-0.1); // Zoom out
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

document.getElementById('ratioFree').addEventListener('click', function () {
  if (cropper) {
    cropper.setAspectRatio(NaN); // Free aspect ratio
  }
});

document.getElementById('flipHorizontal').addEventListener('click', function () {
  if (cropper) {
    const data = cropper.getData();
    cropper.scaleX(-cropper.getData().scaleX || -1); // Flip horizontally
  }
});

document.getElementById('flipVertical').addEventListener('click', function () {
  if (cropper) {
    const data = cropper.getData();
    cropper.scaleY(-cropper.getData().scaleY || -1); // Flip vertically
  }
});