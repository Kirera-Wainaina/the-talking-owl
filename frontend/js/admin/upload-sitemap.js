import { 
    showSpinningIcon, 
    hideSpinningIcon, 
    displaySliderAnimation, 
    handleResponse 
} from '../general.js';

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
    })
    .then(response => response.text())
    .then(text => handleResponse(text, 'UPLOAD SITEMAP', '/admin/home'))
}

function transferSitemapToFormData() {
    const formdata = new FormData()
    const input = document.querySelector('form input');
    formdata.append('sitemap', input.files[0]);
    formdata.append('fileNumber', 1);
    return formdata
}