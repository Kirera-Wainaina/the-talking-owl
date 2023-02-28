import { render } from '../render.js';
import { toggleElementClass } from '../general.js';

document.addEventListener('DOMContentLoaded', () => {
    const checkPreviewButton = document.getElementById('check-preview');
    const exitPreviewButton = document.getElementById('exit-preview');
    
    checkPreviewButton.addEventListener('click', () => {
        toggleElementClass(checkPreviewButton, 'hide');
        toggleElementClass(exitPreviewButton, 'hide');
        toggleElementClass(document.getElementById('preview'), 'hide')
        toggleElementClass(document.getElementById('upload-parent-container'), 'hide')
    })
    checkPreviewButton.addEventListener('click', 
        () => render(document.getElementById('preview'), createPreviewData()))

    exitPreviewButton.addEventListener('click', () => {
        toggleElementClass(checkPreviewButton, 'hide');
        toggleElementClass(exitPreviewButton, 'hide');
        toggleElementClass(document.getElementById('preview'), 'hide')
        toggleElementClass(document.getElementById('upload-parent-container'), 'hide')
    })
})

function createPreviewData() {
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
        content: document.querySelector('textarea').value,
        publishedDate: Date.now()
    };
}

function createUrlTitle(title) {
    return title
        .toLowerCase()
        .replace(/ /g, '-')
  	    .replace(/[^A-Za-z-]/g, '')
}