document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('#signup');
    signupForm.addEventListener('submit', handleSignupSubmit);    
})


function handleSignupSubmit(event) {
    event.preventDefault();

    if (!passwordsMatch())
}

function passwordsMatch() {
    const password = document.querySelector('input[name="password"]').value;
    const repeatPassword = document.querySelector('input[name="repeatPassword"]').value;

    if (password === repeatPassword) return true;
    return false
}