
export function showSpinningIcon(button) {
    const spinner = document.createElement('div');
    spinner.id = 'spinner';
    button.setAttribute('disabled', true);
    button.textContent = '';

    button.appendChild(spinner);
}

export function hideSpinningIcon(text) {
    const spinner = document.getElementById('spinner');
    const parent = spinner.parentElement;
    
    parent.textContent = text;
    parent.removeAttribute('disabled');
    spinner.remove()
}