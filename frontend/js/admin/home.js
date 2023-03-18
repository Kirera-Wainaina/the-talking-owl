import { showSpinningIcon, toggleElementClass  } from "../general.js";

const renderButton = document.querySelector('#menu button');
renderButton.addEventListener('click', renderAllPages);

async function renderAllPages(event) {
    showLoadingModal();
    const response = await submitRenderAllPagesRequest();
    handleRenderAllPagesResponse(response)
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

function handleRenderAllPagesResponse(response) {
    let slider;
    hideLoadingModal();
    if (response == 'success') {
        slider = document.getElementById('render-success-slider');
        toggleElementClass(slider, 'hide');
    } else {
        slider = document.getElementById('render-error-slider')
        toggleElementClass(slider, 'hide')
    }
    slider.addEventListener(
        'animationend', 
        () => toggleElementClass(slider, 'hide')
    );
}