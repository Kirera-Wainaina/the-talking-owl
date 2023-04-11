import { showSpinningIcon, hideSpinningIcon } from '../general.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', submitSitemap);
})

function submitSitemap(event) {
    event.preventDefault();
    showSpinningIcon(document.querySelector('button'));
    const formdata = transferSitemapToFormData()
    fetch('/api/admin/upload-sitemap', {
        body: formdata,
        method: 'POST'
    }).then(response => response.text())
    .then(handleResponse)
}

function transferSitemapToFormData() {
    const formdata = new FormData()
    const input = document.querySelector('form input');
    formdata.append('sitemap', input.files[0]);
    formdata.append('fileNumber', 1);
    return formdata
}

function handleResponse(responseText) {
    if (responseText == 'success') {
        hideSpinningIcon('UPLOAD SITEMAP');
        location.href = '/admin/home';
    } else {
        
    }
}