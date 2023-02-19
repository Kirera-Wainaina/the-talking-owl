document.addEventListener('DOMContentLoaded', () => {
    const openUploadButtons = document.querySelectorAll('.open-upload');
    openUploadButtons.forEach(
        button => button.addEventListener('click', toggleUploadContainer));

    const closeButton = document.getElementById('close-icon');
    closeButton.addEventListener('click', toggleUploadContainer)
})

function toggleUploadContainer() {
    const modal = document.getElementById('upload-modal');
    modal.classList.toggle('flex');
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('choose-file-input');

    const chooseFileButton = document.getElementById('choose-file');
    chooseFileButton.addEventListener('click', () => clickFileInput(input));

    input.addEventListener('change', displayImages)
})

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', event => submitImages(event));
})

function clickFileInput(input) {
    input.click();
}

function displayImages(event) {
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
    input.addEventListener('click', removeImageFromUploadContainer)
    return input;
}

function removeImageFromUploadContainer(event) {
    event.preventDefault();
    const parent = event.target.parentElement;
    const imgEl = parent.querySelector('img');
    URL.revokeObjectURL(imgEl.src);
    parent.remove();
}

async function submitImages(event) {
    event.preventDefault();
    const imageURLs = getImageURLs(event.target);
    const formdata = await addImagesToFormData(imageURLs);

    fetch('/api/admin/upload-images', {
        method: 'POST',
        body: formdata,
    }).then(response => console.log(response))
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