
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
    element.classList.remove('hide');
    element.addEventListener(
        'animationend', () => element.classList.add('hide'))
}

export function toggleElementClass(element, className) {
    element.classList.toggle(className)
}

export function getNameOfMonth(index) {
    const MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October','November', 'December'
    ]
    return MONTHS[index]
}

export function urlifySentence(sentence) {
    return sentence
        .toLowerCase()
        .replace(/ /g, '-')
  	    .replace(/[^A-Za-z-]/g, '')
}