export function sendProfile(id) {
  //loader.style.display = 'flex';
  fetch(`sendProfile/${id}/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
  })
  .then(response => response.json())
  .then(result => {
      if (result.status === 'success') {
          console.log(result.message);

          /*
          messages.innerHTML = result.message;

          setTimeout(function () {
              messages.style.opacity = '0';
          }, 3000);

          */
      } else {

          console.error('Error:', result.message);
      }
  })
  .catch(error => {
      loader.style.display = 'none';
      console.error('Error fetching data:', error);
  });
}
