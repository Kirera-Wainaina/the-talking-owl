import { displaySliderAnimation, generateRandomName, hideSpinningIcon, showSpinningIcon } from "../general.js";

document.addEventListener('DOMContentLoaded', () => {
    attachListenerToFileButton();

    const fileInput = document.querySelector('input[type="file"]');
    fileInput.addEventListener('change', displayProfileImage);

    if (location.pathname === '/admin/add-authors') {
        // this file is shared by edit-author.js,
        // this event listener is only for this file
        const form = document.querySelector('form');
        form.addEventListener('submit', submitAuthor)    
    }
})

function attachListenerToFileButton() {
    const fileInput = document.querySelector('input[type="file"]');
    const addImageButton = document.getElementById('choose-image');
    
    addImageButton.onclick = () => fileInput.click();
}

function displayProfileImage(event) {
    const url = URL.createObjectURL(event.target.files[0]);
    const element = document.getElementById('profile-image-preview');

    if (element) {
        element.src = url;
    } else {
        createImagePreview(url);
    }
}

export function createImagePreview(url) {
    const profileImageLabel = document.getElementById('profile-image-label');
    const img = document.createElement('img');
    img.src = url;
    img.id = 'profile-image-preview';
    profileImageLabel.insertAdjacentElement('afterend', img)    
}

async function submitAuthor(event) {
    event.preventDefault();
    showSpinningIcon(document.querySelector('button[type="submit"]'));

    const formdata = new FormData(event.target);
    giveImageRandomName(formdata);
    formdata.append('fileNumber', 1);
    fetch('/api/admin/add-author.js', {
        method: 'POST',
        body: formdata
    })
    .then(response => response.text())
    .then(handleSubmitAuthorResponse)
}

export function handleSubmitAuthorResponse(response) {
    hideSpinningIcon('SAVE AUTHOR');
    if (response == 'forbidden') {
        displaySliderAnimation('forbidden-error');
    } else if (response == 'error') {
        displaySliderAnimation('server-error')
    } else {
        location.href = '/admin/manage-authors'
    }
}

function giveImageRandomName(formdata) {
    const img = formdata.get('profilePhoto');
    formdata.append(generateRandomName(), img);
    formdata.delete('profilePhoto');
}