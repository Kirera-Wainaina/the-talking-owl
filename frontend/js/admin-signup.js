var signupForm, loginForm;

document.addEventListener('DOMContentLoaded', () => {
    signupForm = document.querySelector('#signup');
    signupForm.addEventListener('submit', handleSignupSubmit);    
})


function handleSignupSubmit(event) {
    event.preventDefault();

    if (!passwordsMatch()) {
        displayPasswordMatchingError();
        return
    }

    submitSignupData()
}

function passwordsMatch() {
    const password = document.querySelector('input[name="password"]').value;
    const repeatPassword = document.querySelector('input[name="repeatPassword"]').value;

    if (password === repeatPassword) return true;
    return false
}

function displayPasswordMatchingError() {
    const error = document.getElementById('password-error');
    error.classList.toggle('hide');
}

function submitSignupData() {
    const formData = new FormData(signupForm);

    fetch('/api/admin-signup', {
        method: 'POST',
        body: formData
    })
    .then(response => console.log(response))
}