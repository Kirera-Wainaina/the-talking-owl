import { createImageElement, createTextElement } from "../general.js";

document.addEventListener('DOMContentLoaded', async () => {
    const authorDetailsContainer = document.querySelector('#author-list');
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
    const a = document.createElement('a');
    a.href = `/admin/edit-author?id=${authorDetails.id}`;
    a.append(createImageElement(
        authorDetails.profileImageLink, 
        'profile image', 
        100, 
        100
    ))
    a.append(createTextElement('p', authorDetails.authorName))
    a.classList.add('author-details')
    return a
}