import { displaySliderAnimation } from "../general.js";
import { createPreviewData, handleSubmit } from "./upload-article.js";

document.addEventListener('DOMContentLoaded', fetchArticleData);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-form');
    if (form) {
        form.addEventListener('submit', event => {
            event.preventDefault();
            handleSubmit(createDataToEdit(), submitArticleEdit)
        })
    }
})

function fetchArticleData() {
    const params = new URLSearchParams(location.search);
    fetch(`/api/articles?urlTitle=${params.get('urlTitle')}&id=${params.get('id')}`)
        .then(response => response.json())
        .then(data => inputDataIntoForm(data[0]));
}

function inputDataIntoForm(data) {
    inputDataIntoInputElements(data);
    inputContentIntoTextArea(data.content);
    setCategory(data.category);
}

function inputDataIntoInputElements(data) {
    const inputs = document.querySelectorAll('form input');
    inputs.forEach(input => {
        const value = data[input.name];
        if (value) input.value = data[input.name]
    });
}

function inputContentIntoTextArea(content) {
    const textArea = document.querySelector('form textarea');
    textArea.value = content;
}

function setCategory(category) {
    const select = document.querySelector('form select');
    select.value = category;
}

function submitArticleEdit(formdata) {
    fetch('/api/admin/edit-article', {
        method: 'POST',
        body: formdata
    }).then(handleEditResponse);
}

async function handleEditResponse(response) {
    if (response.status == 200) {
        location.href = '/admin/edit-articles';
    } else {
        displaySliderAnimation("article-edit-error")
    }
}

function createDataToEdit() {
    const previewData = createPreviewData();
    const params = new URLSearchParams(location.search);
    delete previewData.publishedDate

    return {
        ...previewData,
        id: params.get('id'),
        urlTitle: params.get('urlTitle')
    }
}