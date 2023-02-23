import { displaySliderAnimation, hideSpinningIcon, showSpinningIcon } from "../general.js";

document.addEventListener('DOMContentLoaded', () => {
    const openUploadButtons = document.querySelectorAll('.open-upload');
    openUploadButtons.forEach(
        button => button.addEventListener(
            'click', 
            () => toggleElementClass(document.getElementById('upload-modal'), 'flex')));

    const closeButton = document.getElementById('close-icon');
    closeButton.addEventListener(
        'click', 
        () => toggleElementClass(document.getElementById('upload-modal'), 'flex'))
})

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('choose-file-input');

    const chooseFileButton = document.getElementById('choose-file');
    chooseFileButton.addEventListener('click', () => clickFileInput(input));

    input.addEventListener('change', displayImagesToUpload)
})

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', event => submitImages(event));
})

document.addEventListener('DOMContentLoaded', displayUploadedImages);

document.addEventListener('DOMContentLoaded', () => {
    const deleteExistingImagesButtons = document.querySelectorAll('.delete-images');
    deleteExistingImagesButtons.forEach(button => button.addEventListener('click', () => {
        deleteMarkedImages();
        toggleElementClass(document.getElementById('deleting-images-modal'), 'flex')
    }))
})

function toggleElementClass(element, className) {
    element.classList.toggle(className)
}

function clickFileInput(input) {
    input.click();
}

function displayImagesToUpload(event) {
    const container = document.getElementById('images-to-upload');
    container.appendChild(createImageContainers(event.target.files))
}

function createImageContainers(files) {
    const fragment = new DocumentFragment();
    for (const file of files) {
        fragment.append(createSingleImageContainer(file))
    }
    return fragment
}

function createSingleImageContainer(file) {
    const div = document.createElement('div');
    const imgEl = createImageElement(URL.createObjectURL(file))
    const input = createCloseIconElement();

    div.append(input);
    div.append(imgEl);
    div.classList.add('single-image-container');
    return div;
}

function createImageElement(src) {
    const imgEl = document.createElement('img');
    imgEl.src = src;
    return imgEl
}

function createCloseIconElement() {
    const input = createImageInputButton('/frontend/images/close_icon.svg', 'close-icon')
    input.classList.add('single-image-close-icon');
    input.addEventListener('click', event => event.preventDefault())
    input.addEventListener('click', 
        event => removeImageFromUploadContainer(event.target.parentElement))
    return input;
}

function removeImageFromUploadContainer(imageContainer) {
    const imgEl = imageContainer.querySelector('img');
    URL.revokeObjectURL(imgEl.src);
    imageContainer.remove();
}

async function submitImages(event) {
    event.preventDefault();
    const imageURLs = getImageURLs(event.target);
    const formdata = await addImagesToFormData(imageURLs);
    deactivateSubmitButton()

    fetch('/api/admin/upload-images', {
        method: 'POST',
        body: formdata,
    }).then(handleImageSaveResponse)
}

function getImageURLs(form) {
    const imageElements = form
        .querySelectorAll('.single-image-container img:first-of-type');
    const urls = [];
    imageElements.forEach(img => urls.push(img.src));
    return urls;
}

async function addImagesToFormData(imageURLs) {
    const formdata = new FormData();
    await Promise.all(imageURLs.map(imageURL => addSingleImageToFormData(formdata, imageURL)))
    formdata.append('fileNumber', imageURLs.length)
    return formdata
}

async function addSingleImageToFormData(formdata, imageURL) {
    const file = await getBlob(imageURL);
    const name = generateRandomName();
    formdata.append(name, file);
}

function getBlob(imageURL) {
    return new Promise((resolve, reject) => {
        fetch(imageURL)
            .then(response => resolve(response.blob()))
            .catch(error => reject(error))
    })
}

function generateRandomName() {
    const number = Math.trunc(Math.random()*1e6);
    const date = Date.now();
    return `${number}-${date}`
}

function deactivateSubmitButton() {
    const button = document.querySelector('button[type="submit"]');
    showSpinningIcon(button);
}

function handleImageSaveResponse(response) {
    hideSpinningIcon('Upload Images');
    if (response.status == 200) {
        removeAllImagesFromUploadContainer();
        location.reload();
    } else {
        displaySliderAnimation('image-upload-error');
    }
}

function removeAllImagesFromUploadContainer() {
    const imageContainers = document.querySelectorAll('.single-image-container');
    imageContainers.forEach(container => removeImageFromUploadContainer(container));
}

async function displayUploadedImages() {
    const images = await retrieveUploadedImages();
    inputImagesIntoExistingImagesContainer(images)
}

function retrieveUploadedImages() {
    return fetch('/api/images?field=link&field=name')
        .then(response => response.json())
}

function inputImagesIntoExistingImagesContainer(images) {
    const uploadImagesContainer = document.getElementById('existing-images');
    const fragment = createFragmentOfExistingImages(images);
    uploadImagesContainer.appendChild(fragment);
}

function createFragmentOfExistingImages(images) {
    const fragment = new DocumentFragment();
    images.forEach(image => fragment.append(createExistingImageContainer(image)));
    return fragment;
}

function createExistingImageContainer(image) {
    const container = document.createElement('div');
    const deleteIcon = createImageInputButton('/frontend/images/delete-icon.svg', 'delete-icon');
    deleteIcon.addEventListener('click', markImageForDeletion);
    deleteIcon.addEventListener('click', handleDisplayOfDeleteImagesButton)

    container.classList.add('existing-image')
    container.append(deleteIcon);
    container.append(createExistingImageElement(image));
    container.append(createLinkContainer(image));

    return container;
}

function createExistingImageElement(image) {
    const imageEl = document.createElement('img');
    imageEl.src = image.link;
    imageEl.id = image.id;
    imageEl.dataset.name = image.name;
    return imageEl
}

function createLinkContainer(image) {
    const div = document.createElement('div');
    const p = createImageLinkText(image);
    const input = createImageInputButton('/frontend/images/link-icon.svg', 'click image link');
    input.addEventListener('click', copyLinkToClipboard)

    div.appendChild(p);
    div.appendChild(input);
    div.classList.add('image-link');
    return div;
}

function createImageInputButton(link, altText) {
    const input = document.createElement('input');
    input.type = 'image'
    input.src = link;
    input.alt = altText;
    return input
}

function createImageLinkText(image) {
    const p = document.createElement('p');
    p.textContent = image.link;
    return p
}

function markImageForDeletion(event) {
    const parentElement = event.target.parentElement;
    parentElement.classList.toggle('marked-for-deletion');
}

function handleDisplayOfDeleteImagesButton(event) {
    const markedImages = document.querySelectorAll('.marked-for-deletion');

    if (markedImages.length) {
        enableDeletion()
    } else {
        disableDeletion()
    }
}

function enableDeletion() {
    const deleteImagesButton = document.getElementById('delete-images-button');
    const deleteImagesIcon = document.getElementById('delete-images-icon');

    deleteImagesButton.removeAttribute('disabled');
    deleteImagesIcon.removeAttribute('disabled');
}

function disableDeletion() {
    const deleteImagesButton = document.getElementById('delete-images-button');
    const deleteImagesIcon = document.getElementById('delete-images-icon');

    deleteImagesButton.setAttribute('disabled', '');
    deleteImagesIcon.setAttribute('disabled', '');
}

function copyLinkToClipboard(event) {
    const parentElement = event.target.parentElement;
    const linkText = parentElement.querySelector('p').textContent;

    navigator.clipboard.writeText(linkText)
        .then(() => displaySliderAnimation('copied-to-clipboard'))
        .catch(error => console.log('error copying link to clipboard', error))
}

function deleteMarkedImages() {
    const images = document.querySelectorAll('.marked-for-deletion > img');
    const data = [];
    images.forEach(image => data.push(createObjectWithImageDeletionData(image)));
    submitImageDataForDeletion(data);
}

function createObjectWithImageDeletionData(image) {
    return {
        name: image.dataset.name,
        id: image.id
    }
}

function submitImageDataForDeletion(data) {
    const formdata = new FormData();
    formdata.append('data', JSON.stringify(data))
    
    fetch('/api/admin/delete-images', {
        method: 'POST',
        body: formdata
    }).then(response => console.log(response))
}