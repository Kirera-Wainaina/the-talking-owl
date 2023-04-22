import { createImagePreview, handleSubmitAuthorResponse } from "./add-authors.js";
import { showSpinningIcon } from "../general.js";

document.addEventListener('DOMContentLoaded', async () => {
    const [ authorDetails ] = await retrieveAuthorData();
    displayAuthorDetails(authorDetails);

    if (location.pathname == '/admin/edit-author') {
        const form = document.querySelector('form');
        form.addEventListener('submit', editAuthor)
    }
})

function retrieveAuthorData() {
    const params = new URLSearchParams(location.search);
    return fetch(`/api/authors?id=${params.get('id')}`)
    .then(response => response.json())
}

function displayAuthorDetails(authorDetails) {
    createImagePreview(authorDetails.profileImageLink);
    setProfileImageName(authorDetails.profileImageName);
    displayAuthorName(authorDetails.authorName);
    displayAuthorBio(authorDetails.bio);
}

function displayAuthorName(name) {
    const nameInput = document.querySelector('input[name="authorName"]');
    nameInput.value = name;
}

function displayAuthorBio(bio) {
    const bioInput = document.querySelector('textarea[name="bio"]')
    bioInput.value = bio;
}

function editAuthor(event) {
    event.preventDefault();
    showSpinningIcon(document.querySelector('button[type="submit"]'));

    const formdata = new FormData(event.target);
    changeImageName(formdata);
    formdata.append('fileNumber', 1);
    fetch('/api/admin/edit-author', {
        method: 'POST',
        body: formdata
    })
    .then(response => response.text())
    .then(handleSubmitAuthorResponse)
}

function setProfileImageName(name) {
    const image = document.getElementById('profile-image-preview');
    image.dataset.profileImageName = name;
}

function changeImageName(formdata) {
    if (formdata.has('profilePhoto')) {
        const image = formdata.get('profilePhoto');
        const imageElement = document.getElementById('profile-image-preview');
        formdata.append(imageElement.dataset.profileImageName, image);
        formdata.delete('profilePhoto')
    }
}