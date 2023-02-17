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
    container.appendChild(createImageElements(event.target.files))
}

function createImageElements(files) {
    const fragment = new DocumentFragment();
    for (const file of files) {
        const imgEl = document.createElement('img')
        imgEl.src = URL.createObjectURL(file);
        fragment.append(imgEl)
    }
    return fragment
}