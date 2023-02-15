import { render } from '../article.js';

document.addEventListener('DOMContentLoaded', () => {
    const checkPreviewButton = document.getElementById('check-preview');
    const exitPreviewButton = document.getElementById('exit-preview');
    
    checkPreviewButton.addEventListener('click', togglePreview);
    checkPreviewButton.addEventListener('click', 
        () => togglePreviewButtons(checkPreviewButton, exitPreviewButton));
    checkPreviewButton.addEventListener('click', 
        () => render(document.getElementById('preview'), createPreviewData()))

    exitPreviewButton.addEventListener('click', togglePreview);
    exitPreviewButton.addEventListener('click', 
        () => togglePreviewButtons(checkPreviewButton, exitPreviewButton));
})



function togglePreview() {
    const preview = document.getElementById('preview');
    preview.classList.toggle('hide');
}

function togglePreviewButtons(checkPreview, exitPreview) {
    checkPreview.classList.toggle('hide');
    exitPreview.classList.toggle('hide')
}

function createPreviewData() {
    return {
        title: document.querySelector('input[name="title"]').value,
        category: document.querySelector('select[name="category"]').value,
        description: document.querySelector('input[name="description"]').value,
        coverPhoto: document.querySelector('input[name="coverPhoto"]').value,
        content: document.querySelector('textarea').value
    };
}

const uploadLandscapeImageButton = document.getElementById('landscape-image-button');
uploadLandscapeImageButton.addEventListener('click', clickUploadLandscapeImageInput);

function clickUploadLandscapeImageInput() {
    const input = document.getElementById('landscape-image-input');
    input.click()
}

const uploadPortraitImageButton = document.getElementById('portrait-image-button');
uploadPortraitImageButton.addEventListener('click', clickUploadPortraitImageInut)

function clickUploadPortraitImageInut() {
    const input = document.getElementById('portrait-image-input');
    input.click();
}

const landscapeImageInput = document.getElementById('landscape-image-input');
landscapeImageInput.addEventListener(
    'change', 
    event => previewImage(event, document.getElementById('landscape-image-preview')));

const portraitImageInput = document.getElementById('portrait-image-input');
portraitImageInput.addEventListener(
    'change', 
    event => previewImage(event, document.getElementById('portrait-image-preview')));

const thumbnailImageInput = document.getElementById('thumbnail-image-input');
thumbnailImageInput.addEventListener(
    'change', 
    event => previewImage(event, document.getElementById('thumbnail-image-preview')));

function previewImage(event, imageElement) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    imageElement.src = url;
    imageElement.classList.remove('hide');
}