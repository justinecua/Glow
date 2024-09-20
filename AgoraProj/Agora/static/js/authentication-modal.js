import { validatelogin } from "./ajax/validatelogin.js"
import { signup } from "./ajax/signup.js"
import { fetchNewUsers } from "./ajax/newOnGlow.js"

let LoginOverlaybtn = document.getElementById('LoginOverlay-btn');
let LoginOverlay = document.getElementById('Login-Overlay');
let SignUpOverlay = document.getElementById('SignUp-Overlay');
let NRG_Register = document.getElementById('NRG_Register');
let LoginContainer = document.getElementById('Login-Container');
let SignupContainer = document.getElementById('Signup-Container');
let submitlogin = document.getElementById('submit-login');
let Footerlogin = document.getElementById('Footer-login');
let FooterSignup = document.getElementById('Footer-Signup');
let emaillogin = document.getElementById('email-login');
let passwordlogin = document.getElementById('password-login');
let submitsignup = document.getElementById('submit-signup');
let usernamesignup = document.getElementById('username-signup');
let emailsignup = document.getElementById('email-signup');
let passsignup = document.getElementById('pass-signup');
let pass2signup = document.getElementById('pass2-signup');
let signUp_redirect = document.getElementById('signUp-redirect');
let login_redirect = document.getElementById('login-redirect');
let loginNav = document.getElementById('loginNav');

fetchNewUsers();

signUp_redirect.addEventListener('click', async() =>{
  LoginOverlay.style.display = "none";
  SignUpOverlay.style.display = "flex";
})

login_redirect.addEventListener('click', async() =>{
  LoginOverlay.style.display = "flex";
  SignUpOverlay.style.display = "none";
})

loginNav.addEventListener('click', async() =>{
  LoginOverlay.style.display = "flex";
})

LoginOverlaybtn.addEventListener('click', async() =>{
  LoginOverlay.style.display = "flex";
})

Footerlogin.addEventListener('click', async() =>{
  LoginOverlay.style.display = "flex";
})

FooterSignup.addEventListener('click', async() =>{
  SignUpOverlay.style.display = "flex";
})

NRG_Register.addEventListener('click', async() =>{
  SignUpOverlay.style.display = "flex";
})


/*-----------------------Login-------------------------*/

function handleLogin(event) {
  event.preventDefault();
  if (emaillogin.checkValidity() && passwordlogin.checkValidity()) {
    let loginObject = {
      email: emaillogin.value,
      password: passwordlogin.value
    };
    console.log(loginObject);

    validatelogin(loginObject);

  } else {
    if (!emaillogin.checkValidity()) {
      emaillogin.reportValidity();
    } else if (!passwordlogin.checkValidity()) {
      passwordlogin.reportValidity();
    }
  }
}

submitlogin.addEventListener('click', function(event) {
  handleLogin(event);
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    handleLogin(event);
  }
});

submitsignup.addEventListener('click', function(event){
  event.preventDefault();

  if (usernamesignup.checkValidity() && emailsignup.checkValidity() && passsignup.checkValidity() && pass2signup.checkValidity()){
    let signupObject = {
      username: usernamesignup.value,
      email: emailsignup.value,
      pass1: passsignup.value,
      pass2: pass2signup.value,
    };
    console.log(signupObject);

    signup(signupObject);

  } else {
    if (!usernamesignup.checkValidity()) {
      usernamesignup.reportValidity();
    } else if (!emailsignup.checkValidity()) {
      emailsignup.reportValidity();
    } else if (!passsignup.checkValidity()) {
      passsignup.reportValidity();
    } else if (!pass2signup.checkValidity()) {
      pass2signup.reportValidity();
    }
  }
})

document.addEventListener("click", (event) => {
  if (event.target.contains(LoginOverlay)) {
      LoginOverlay.style.display = "none";
  }
});

document.addEventListener("click", (event) => {
  if (event.target.contains(SignUpOverlay)) {
      SignUpOverlay.style.display = "none";
  }
});

