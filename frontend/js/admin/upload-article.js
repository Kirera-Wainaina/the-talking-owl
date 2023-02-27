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
        landscapeImage: document.querySelector('input[name="landscapeImage"]').value,
        portraitImage: document.querySelector('input[name="portraitImage"]').value,
        squareThumbnail: document.querySelector('input[name="squareThumbnail"]').value,
        description: document.querySelector('input[name="description"]').value,
        content: document.querySelector('textarea').value
    };
}