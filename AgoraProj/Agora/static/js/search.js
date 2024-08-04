<<<<<<< HEAD

    /* --------------------------- Search Functionality ------------------------------*/
    let GlobalSearch = document.querySelector('.GlobalSearch');
=======
   
    /* --------------------------- Search Functionality ------------------------------*/
    let GlobalSearch = document.getElementById('GlobalSearch');
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
    let SearchResultsContainer = document.querySelector('.Search-Results-Container');
    let ClearButton = document.getElementById('ClearButton');
    
    import { SearchResults } from './ajax/search.js';
    
    GlobalSearch.addEventListener('input', function(){
        let searchInfo = GlobalSearch.value;
        if(GlobalSearch.value.length >= 2){
            SearchResultsContainer.style.display = "flex";
            ClearButton.style.display = "flex";
            SearchResults(searchInfo); 
        }
        else{
            SearchResultsContainer.style.display = "none";
            ClearButton.style.display = "none";
            SearchResultsContainer.innerHTML = '';
        }
    });
    
    ClearButton.addEventListener('click', function(){
        GlobalSearch.value = ''; 
        SearchResultsContainer.style.display = "none"; 
        ClearButton.style.display = "none";
        SearchResultsContainer.innerHTML = '';
    });
<<<<<<< HEAD

/*
=======
    
    /*-------------------------------Edit Profile ------------------------------------------*/
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
let accountID = document.getElementById('accountID');
let EPCoverPhoto = document.querySelector('.EP-CoverPhoto');
let EPFirstname = document.getElementById('EP-Firstname');
let EPLastname = document.getElementById('EP-Lastname');
let EPUsername = document.getElementById('EP-Username');
let EPBio = document.getElementById('EP-Bio');
let EPBirthday = document.getElementById('EP-Birthday');
let SaveEditProfile = document.getElementById('Save-EditProfile');
let EditMyProfile = document.getElementById('Edit-MyProfile');
let EditProfileOverlay = document.getElementById('EditProfile-Overlay');
let EditProfileObject = '';
import { SendEditProfile } from './ajax/send-editprofile.js';  

const { AddCoverPhoto, getCoverPhoto } = await import ("./modal/add-coverphoto.js");
const { AddProfilePhoto, getProfilePhoto } = await import ("./modal/add-profile-photo.js");

AddCoverPhoto();
AddProfilePhoto();
let AccountID = accountID.value;

EPBio.addEventListener('change', function(){
    let epBio = EPBio.value;
    UpdateEditObject();
})

EPBirthday.addEventListener('change', function(){
    let epBirthday = EPBirthday.value;
    UpdateEditObject();
})

function UpdateEditObject(){
    const User_CoverPhoto = getCoverPhoto();
    const User_ProfilePhoto = getProfilePhoto();

    EditProfileObject = {
        accID: AccountID,
        firstname: EPFirstname.value,
        lastname: EPLastname.value,
        username: EPUsername.value,
        bio: EPBio.value,
        birthday: EPBirthday.value,
        cover_photo: User_CoverPhoto,
        profile_photo: User_ProfilePhoto
    }
    return EditProfileObject;
}


SaveEditProfile.addEventListener('click', function(){
    SaveEditProfile.innerHTML = "Saving..."
    UpdateEditObject();
    SendEditProfile(EditProfileObject, AccountID);
})
<<<<<<< HEAD
*/
=======
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
