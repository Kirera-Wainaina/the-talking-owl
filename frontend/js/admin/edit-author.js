import { createImagePreview } from "./add-authors.js";
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

}

function setProfileImageName(name) {
    const image = document.getElementById('profile-image-preview');
    image.dataset.profileImageName = name;
}