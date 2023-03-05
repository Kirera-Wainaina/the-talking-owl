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
    inputs.forEach(input => input.value = data[input.name]);
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
    const text = await response.text();
    console.log(text);
}

function createDataToEdit() {
    const previewData = createPreviewData();
    delete previewData.urlTitle;
    const params = new URLSearchParams(location.search);

    return {
        ...previewData,
        id: params.get('id')
    }
}