import { createImagePreview } from "./add-authors.js";

document.addEventListener('DOMContentLoaded', async () => {
    const [ authorDetails ] = await retrieveAuthorData();
    displayAuthorDetails(authorDetails)
})

function retrieveAuthorData() {
    const params = new URLSearchParams(location.search);
    return fetch(`/api/authors?id=${params.get('id')}`)
    .then(response => response.json())
}

function displayAuthorDetails(authorDetails) {
    createImagePreview(authorDetails.profileImageLink);
}