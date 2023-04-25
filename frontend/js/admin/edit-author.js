import { createImagePreview } from "./add-authors.js";
import { getIdFromURL, handleResponse, showSpinningIcon } from "../general.js";

document.addEventListener('DOMContentLoaded', async () => {
    const [ authorDetails ] = await retrieveAuthorData();
    displayAuthorDetails(authorDetails);

    const editForm = document.getElementById('edit-form');
    editForm.addEventListener('submit', editAuthor);

    const deleteForm = document.getElementById('delete-form');
    deleteForm.addEventListener('submit', deleteAuthor);

    const deleteIcon = document.getElementById('delete-icon');
    deleteIcon.addEventListener('click', displayDeleteForm)
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
    displayAuthorUrl(authorDetails.url);
}

function displayAuthorName(name) {
    const nameInput = document.querySelector('input[name="authorName"]');
    nameInput.value = name;
}

function displayAuthorBio(bio) {
    const bioInput = document.querySelector('textarea[name="bio"]')
    bioInput.value = bio;
}

function displayAuthorUrl(url) {
    const urlInput = document.querySelector('input[name="url"]')
    urlInput.value = url;
}

function editAuthor(event) {
    const id = getIdFromURL();
    event.preventDefault();
    showSpinningIcon(document.getElementById('save-author-button'));

    const formdata = new FormData(event.target);
    changeImageName(formdata);
    formdata.append('id', id);
    fetch('/api/admin/edit-author', {
        method: 'POST',
        body: formdata
    })
    .then(response => response.text())
    .then(text => handleResponse(text, 'SAVE AUTHOR', '/admin/manage-authors'))
}

function setProfileImageName(name) {
    const image = document.getElementById('profile-image-preview');
    image.dataset.profileImageName = name;
}

function changeImageName(formdata) {
    const imageInput = document.querySelector('input[name="profilePhoto"]');
    if (imageInput.files[0]) {
        const image = formdata.get('profilePhoto');
        const imageElement = document.getElementById('profile-image-preview');
        const profileImageName = imageElement.dataset.profileImageName
            .replace('.webp', '');
        formdata.append(profileImageName, image);
        formdata.append('fileNumber', 1);
    }
    formdata.delete('profilePhoto')
}

function displayDeleteForm() {
    const editForm = document.getElementById('edit-form');
    const deleteForm = document.getElementById('delete-form');

    editForm.classList.toggle('hide');
    deleteForm.classList.toggle('hide');
}

function deleteAuthor(event) {
    event.preventDefault();
    showSpinningIcon(document.getElementById('delete-author-button'));

    const formdata = new FormData(event.target);
    formdata.append('authorId', getIdFromURL());

    fetch('/api/admin/delete-author', {
        method: 'POST',
        body: formdata
    })
    .then(response => response.text())
    .then(text => handleResponse(text, 'DELETE AUTHOR', '/admin/manage-authors'))
}