
export function showSpinningIcon(button) {
    const spinner = document.createElement('div');
    spinner.id = 'spinner';
    button.setAttribute('disabled', true);
    button.textContent = '';
    button.classList.add('spinner-parent')

    button.appendChild(spinner);
}

export function hideSpinningIcon(text) {
    const spinner = document.getElementById('spinner');
    const parent = spinner.parentElement;
    
    parent.textContent = text;
    parent.classList.remove('spinner-parent')
    parent.removeAttribute('disabled');
    spinner.remove()
}

export function displaySliderAnimation(elementId) {
    const element = document.getElementById(elementId);
    element.classList.toggle('hide');
    element.addEventListener(
        'animationend', () => element.classList.toggle('hide'))
}