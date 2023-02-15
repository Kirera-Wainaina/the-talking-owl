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