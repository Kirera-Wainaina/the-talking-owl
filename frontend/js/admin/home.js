import { displaySliderAnimation, handleResponse, showSpinningIcon, toggleElementClass  } from "../general.js";

const renderButton = document.querySelector('#menu button');
renderButton.addEventListener('click', renderAllPages);

async function renderAllPages(event) {
    showLoadingModal();
    const responseText = await submitRenderAllPagesRequest();
    hideLoadingModal()
    if (responseText == 'success') {
        displaySliderAnimation('render-success-slider');
    } else {
        handleResponse(responseText, null, location.href);
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