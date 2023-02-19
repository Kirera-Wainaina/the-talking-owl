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