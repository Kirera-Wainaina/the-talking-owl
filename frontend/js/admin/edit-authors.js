import { createImageElement, createTextElement } from "../general.js";

document.addEventListener('DOMContentLoaded', async () => {
    const authorDetailsContainer = document.querySelector('#authors-details');
    const data = await retrieveAuthorDetails();
    const fragment = createAuthorContainers(data);
    
    authorDetailsContainer.appendChild(fragment);
});

function retrieveAuthorDetails() {
    return fetch('/api/authors?field=authorName&field=profileImageLink')
    .then(response => response.json())
}

function createAuthorContainers(data) {
    const fragment = new DocumentFragment();
    data.forEach(authorDetails => {
        fragment.append(createSingleAuthorContainer(authorDetails))
    });
    return fragment
}

function createSingleAuthorContainer(authorDetails) {
    const div = document.createElement('div');
    div.append(createImageElement(
        authorDetails.profileImageLink, 
        'profile image', 
        100, 
        100
    ))
    div.append(createTextElement('p', authorDetails.authorName))
    div.classList.add('details')
    return div
}