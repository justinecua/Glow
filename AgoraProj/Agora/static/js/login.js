function showMessage(){
    var message = document.getElementById('message');

        if (message) {
            message.innerHTML = '';
        }
    }
    setTimeout(showMessage, 3000);