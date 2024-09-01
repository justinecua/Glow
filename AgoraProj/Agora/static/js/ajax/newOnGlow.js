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
        result.accounts.forEach((account) => {
            let DynamicProf;

            if (account.account__profile_photo.indexOf("static") !== -1) {
                DynamicProf = account.account__profile_photo;
                
                let NewProfParent = document.createElement('div');
                NewProfParent.className = "NewProfParent";
                let NewProf = document.createElement('img');
                NewProf.className = "NewProf";
                NewProf.src = DynamicProf;
                NewProfParent.appendChild(NewProf);
                NRMContents.appendChild(NewProfParent);

            } else {
                DynamicProf = account.account__profile_photo + "/tr:w-42,h-42";
                
                let NewProfParent = document.createElement('div');
                NewProfParent.className = "NewProfParent";
                let NewProf = document.createElement('img');
                NewProf.className = "NewProf";
                NewProf.src = DynamicProf;
                NewProfParent.appendChild(NewProf);
                NRMContents.appendChild(NewProfParent);

                
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

