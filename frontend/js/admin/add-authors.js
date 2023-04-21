import { hideSpinningIcon, showSpinningIcon } from "../general.js";

document.addEventListener('DOMContentLoaded', () => {
    attachListenerToFileButton();

    const fileInput = document.querySelector('input[type="file"]');
    fileInput.addEventListener('change', displayProfileImage);

    const form = document.querySelector('form');
    form.addEventListener('submit', submitAuthor)
})

function attachListenerToFileButton() {
    const fileInput = document.querySelector('input[type="file"]');
    const addImageButton = document.querySelector('input[value="Add Image"]');
    
    addImageButton.onclick = () => fileInput.click();
}

function displayProfileImage(event) {
    const profileImageLabel = document.getElementById('profile-image-label');
    const img = document.createElement('img');
    img.src = URL.createObjectURL(event.target.files[0]);
    img.id = 'profile-image-preview';
    profileImageLabel.insertAdjacentElement('afterend', img)
}

async function submitAuthor(event) {
    event.preventDefault();
    showSpinningIcon(document.querySelector('button[type="submit"]'));

    // const formdata = await enterDetailsIntoFormdata(event.target);
    const formdata = new FormData(event.target);
    formdata.append('fileNumber', 1);
    fetch('/api/admin/add-author.js', {
        method: 'POST',
        body: formdata
    })
    .then(response => response.text())
    .then(handleSubmitAuthorResponse)
}

function handleSubmitAuthorResponse(response) {
    hideSpinningIcon('SAVE AUTHOR');
    if (response == 'forbidden') {
        displayErrorSlider('forbidden-error');
    } else if (response == 'error') {
        displayErrorSlider('server-error');
    } else {
        location.href = '/admin/manage-authors'
    }
}

function displayErrorSlider(elementId) {
    const slider = document.getElementById(elementId);
    slider.classList.remove('hide');
    slider.onanimationend = () => slider.classList.add('hide');
}