var signupForm, loginForm;

document.addEventListener('DOMContentLoaded', () => {
    signupForm = document.querySelector('#signup');
    signupForm.addEventListener('submit', handleSignupSubmit);
    signupForm.addEventListener('focusin', removeErrors)
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
    .then(handleSignupResponse)
}

function handleSignupResponse(response) {
    if (response.status == 401) {
        toggleError(document.getElementById('unauthorized-error'))
    } else if (response.status == 200) {
        redirectToAdminHome()
    } else {
        toggleError(document.getElementById('server-error'));
    }
}

function toggleError(error) {
    error.classList.toggle('hide')
}

function removeErrors(event) {
    const errorElements = event.currentTarget.querySelectorAll('.error');
    errorElements.forEach(element => {
        if (!element.classList.contains('hide')) {
            toggleError(element)
        }
    });
}

function redirectToAdminHome() {
    location.pathname = '/admin/home'
}