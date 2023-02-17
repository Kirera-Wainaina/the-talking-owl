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
    const chooseFileButton = document.getElementById('choose-file');
    chooseFileButton.addEventListener('click', clickFileInput);
})

function clickFileInput() {
    const input = document.getElementById('choose-file-input');
    input.click();
}