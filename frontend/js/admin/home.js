import { showSpinningIcon, toggleElementClass  } from "../general.js";

const renderButton = document.querySelector('#menu button');
renderButton.addEventListener('click', renderAllPages);

function renderAllPages(event) {
    showLoadingModal();
}

function showLoadingModal() {
    const modal = document.getElementById('modal');
    toggleElementClass(modal, 'hide');
    showSpinningIcon(modal);
}