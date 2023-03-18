import { showSpinningIcon, toggleElementClass  } from "../general.js";

const renderButton = document.querySelector('#menu button');
renderButton.addEventListener('click', renderAllPages);

async function renderAllPages(event) {
    showLoadingModal();
    const response = await submitRenderAllPagesRequest();
    hideLoadingModal();
    if (response == 'success') {
        toggleElementClass(document.getElementById('render-success-slider'), 'hide')
    } else {
        toggleElementClass(document.getElementById('render-error-slider'), 'hide')
    }
}

function showLoadingModal() {
    const modal = document.getElementById('modal');
    toggleElementClass(modal, 'hide');
    showSpinningIcon(modal);
}

function hideLoadingModal() {
    const modal = document.getElementById('modal');
    toggleElementClass(modal, 'hide');
}

function submitRenderAllPagesRequest() {
    return fetch(
        '/api/admin/render-all-pages',
        { method: 'POST'}
    ).then(response => response.text())
}