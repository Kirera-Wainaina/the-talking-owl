import { render } from '../render.js';
import { toggleElementClass, showSpinningIcon, hideSpinningIcon, 
    urlifySentence, displaySliderAnimation } from '../general.js';

document.addEventListener('DOMContentLoaded', () => {
    const checkPreviewButton = document.getElementById('check-preview');
    const exitPreviewButton = document.getElementById('exit-preview');
    
    checkPreviewButton.addEventListener('click', () => {
        toggleElementClass(checkPreviewButton, 'hide');
        toggleElementClass(exitPreviewButton, 'hide');
        toggleElementClass(document.getElementById('preview'), 'hide');
        toggleElementClass(document.getElementById('upload-parent-container'), 'hide');
        hideNav();
    })
    checkPreviewButton.addEventListener('click', 
        () => render(document.getElementById('preview'), createPreviewData()))

    exitPreviewButton.addEventListener('click', () => {
        toggleElementClass(checkPreviewButton, 'hide');
        toggleElementClass(exitPreviewButton, 'hide');
        toggleElementClass(document.getElementById('preview'), 'hide');
        toggleElementClass(document.getElementById('upload-parent-container'), 'hide');
        showNav()
    })
})

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#upload-form');
    if (form) {
        form.addEventListener('submit', event => {
            event.preventDefault();
            handleSubmit(createDataToSubmit(), submitArticle)
        });
    }
})

document.addEventListener('DOMContentLoaded', displayAuthors)

export function createPreviewData() {
    return {
        title: document.querySelector('input[name="title"]').value,
        category: document.querySelector('select[name="category"]').value,
        landscapeImage: document.querySelector('input[name="landscapeImage"]').value,
        landscapeImageText: document.querySelector('input[name="landscapeImageText"]').value,
        portraitImage: document.querySelector('input[name="portraitImage"]').value,
        portraitImageText: document.querySelector('input[name="portraitImageText"]').value,
        squareThumbnail: document.querySelector('input[name="squareThumbnail"]').value,
        squareThumbnailText: document.querySelector('input[name="squareThumbnailText"]').value,
        description: document.querySelector('input[name="description"]').value,
        authorId: document.querySelector('select[name="authorId"]').value,
        content: document.querySelector('textarea').value,
        relatedArticle1: document.querySelector('input[name="relatedArticle1"]').value,
        relatedArticle2: document.querySelector('input[name="relatedArticle2"]').value,
        publishedDate: Date.now(),
        updatedDate: Date.now()
    };
}

export function handleSubmit(dataToSubmit, submitArticle) {
    showSpinningIcon(document.querySelector('button[type="submit"]'))
    
    const formdata = createFormData(dataToSubmit);
    submitArticle(formdata);
}

function createDataToSubmit() {
    const previewData = createPreviewData();
    return {
        ...previewData,
        urlTitle: urlifySentence(previewData.title)
    }
}

function createFormData(data) {
    const formdata = new FormData()
    const keys = Object.keys(data);

    keys.forEach(key => formdata.append(key, data[key]));
    return formdata
}

function submitArticle(formdata) {
    fetch('/api/admin/upload-article', {
        method: 'POST',
        body: formdata
    })
    .then(handleResponse);
}

async function handleResponse(response) {
    const text = await response.text()
    if (response.status == 200) {
        location.href = '/admin/home';
    } else {
        if (text == 'url-exists') {
            displaySliderAnimation('existing-title-error');
        } else {
            displaySliderAnimation('article-upload-error')
        }
        hideSpinningIcon('Submit Article');
    }
}

async function displayAuthors() {
    const authors = await retrieveAuthors();
    const fragment = createAuthorOptionsFragment(authors);
    const select = document.querySelector('select[name="authorId"]');
    select.append(fragment); 
}
function retrieveAuthors() {
    return fetch('/api/authors?field=authorName&field=id')
        .then(response => response.json())
}

function createAuthorOptionsFragment(authors) {
    const fragment = new DocumentFragment();
    authors.forEach(author => fragment.append(createSingleAuthorOption(author)));
    return fragment
}

function createSingleAuthorOption(author) {
    const option = document.createElement('option');
    option.value = author.id;
    option.textContent = author.authorName;
    return option
}

function hideNav() {
    const nav = document.querySelector('nav');
    nav.classList.add('hide');
}

function showNav() {
    const nav = document.querySelector('nav');
    nav.classList.remove('hide');
}