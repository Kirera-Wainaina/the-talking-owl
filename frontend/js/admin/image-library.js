import { displaySliderAnimation, hideSpinningIcon, showSpinningIcon } from "../general.js";

document.addEventListener('DOMContentLoaded', () => {
    const openUploadButtons = document.querySelectorAll('.open-upload');
    openUploadButtons.forEach(
        button => button.addEventListener('click', toggleUploadContainer));

    const closeButton = document.getElementById('close-icon');
    closeButton.addEventListener('click', toggleUploadContainer)
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

document.addEventListener('DOMContentLoaded', displayUploadedImages)

function toggleUploadContainer() {
    const modal = document.getElementById('upload-modal');
    modal.classList.toggle('flex');
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
    const input = document.createElement('input');
    input.src = "/frontend/images/close_icon.svg";
    input.type = 'image';
    input.alt = 'close-icon'
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
    // console.log(images)
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
    container.classList.add('existing-image')
    const imageElement = createExistingImageElement(image);
    container.append(imageElement);
    return container;
}

function createExistingImageElement(image) {
    const imageEl = document.createElement('img');
    imageEl.src = image.link;
    imageEl.id = image.id;
    imageEl.dataset.name = image.name;
    return imageEl
}