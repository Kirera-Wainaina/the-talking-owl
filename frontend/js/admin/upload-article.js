import { render } from '../render.js';
import { toggleElementClass, showSpinningIcon, hideSpinningIcon, 
    urlifySentence, displaySliderAnimation } from '../general.js';

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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#upload-form');
    if (form) {
        form.addEventListener('submit', event => handleSubmit(event, submitArticle));
    }
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

export function handleSubmit(event, submitArticle) {
    event.preventDefault();
    showSpinningIcon(document.querySelector('button[type="submit"]'))
    
    const previewData = createPreviewData();
    const dataToSubmit = {
        ...previewData, 
        urlTitle: urlifySentence(previewData.title)
    }
    const formdata = createFormData(dataToSubmit);
    submitArticle(formdata);
}

function createFormData(data) {
    const formdata = new FormData()
    const keys = Object.keys(data);

    keys.forEach(key => formdata.append(key, data[key]));
    return formdata
}

function submitArticle(formdata) {
    fetch('/api/admin/upload-article', {
        method: 'POST',
        body: formdata
    })
    .then(handleResponse);
}

async function handleResponse(response) {
    const text = await response.text()
    if (response.status == 200) {
        location.href = '/admin/home';
    } else {
        if (text == 'url-exists') {
            displaySliderAnimation('existing-title-error');
        } else {
            displaySliderAnimation('article-upload-error')
        }
        hideSpinningIcon('Submit Article');
    }
}