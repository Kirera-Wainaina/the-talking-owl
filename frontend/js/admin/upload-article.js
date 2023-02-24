import { render } from '../article.js';
import { toggleElementClass } from '../general.js';

document.addEventListener('DOMContentLoaded', () => {
    const checkPreviewButton = document.getElementById('check-preview');
    const exitPreviewButton = document.getElementById('exit-preview');
    
    checkPreviewButton.addEventListener('click', 
        () => toggleElementClass(document.getElementById('preview'), 'hide'));
    checkPreviewButton.addEventListener('click', () => {
        toggleElementClass(checkPreviewButton, 'hide');
        toggleElementClass(exitPreviewButton, 'hide');
    })
    checkPreviewButton.addEventListener('click', 
        () => render(document.getElementById('preview'), createPreviewData()))

    exitPreviewButton.addEventListener('click', 
        () => toggleElementClass(document.getElementById('preview'), 'hide'));
    exitPreviewButton.addEventListener('click', () => {
        toggleElementClass(checkPreviewButton, 'hide');
        toggleElementClass(exitPreviewButton, 'hide');
    })
})

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
uploadLandscapeImageButton.addEventListener(
    'click', 
    () => clickImageInput(document.getElementById('landscape-image-input')));

const uploadPortraitImageButton = document.getElementById('portrait-image-button');
uploadPortraitImageButton.addEventListener(
    'click', 
    () => clickImageInput(document.getElementById('portrait-image-input')))


const uploadThumbnailImageButton = document.getElementById('thumbnail-image-button');
uploadThumbnailImageButton.addEventListener(
    'click', 
    () => clickImageInput(document.getElementById('thumbnail-image-input')))

function clickImageInput(imageInput) {
    imageInput.click()
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