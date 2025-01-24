let NRMContents = document.querySelector('.NRM-Contents');

export function fetchNewUsers(loginObject) {
    fetch('fetchNewUsers/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.accounts);
        result.accounts.forEach((account) => {
            let DynamicProf;

            if (account.account__profile_photo && account.account__profile_photo.indexOf("static") !== -1) {
                DynamicProf = account.account__profile_photo;
            } 
            else if (account.account__profile_photo) {
                DynamicProf = account.account__profile_photo + "/tr:w-42,h-42";
            } 
            else {
                DynamicProf = "static/images/photos-icon.png";
            }

            let NewProfParent = document.createElement('div');
            NewProfParent.className = "NewProfParent";

            let NewProf = document.createElement('img');
            let NewProfName = document.createElement('p');

            NewProf.className = "NewProf";
            NewProfName.className = "NewProfName";
            NewProfName.innerHTML = account.account__firstname;
            NewProf.src = DynamicProf;


            NewProf.onerror = function() {
                NewProf.src = "static/images/photos-icon.png";
            };

            NewProfParent.append(NewProf);

            NRMContents.appendChild(NewProfParent);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

