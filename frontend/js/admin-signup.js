document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('#signup');
    signupForm.addEventListener('submit', handleSubmit);    
})


function handleSubmit(event) {
    event.preventDefault();

    console.log('called')
}