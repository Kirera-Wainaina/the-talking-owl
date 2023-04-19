
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
        .trim()
        .replace(/ /g, '-')
  	    .replace(/[^A-Za-z-]/g, '')
}

export function createImageElement(src, alt, width, height) {
    const imgEl = document.createElement('img');
    imgEl.src = src;
    imgEl.alt = alt;
    if (!width) {
        throw new Error("Width cannot be undefined");
    } else if (!height) {
        throw new Error('Height cannot be undefined');
    } else {
        imgEl.width = width;
        imgEl.height = height;
    }
    return imgEl
}

export function createTextElement(tagName, textContent) {
    const element = document.createElement(tagName);
    element.textContent = textContent;
    return element;
}

export function createDateString(milliseconds) {
    const dateObj = new Date(Number(milliseconds));
    const month = getNameOfMonth(dateObj.getMonth());
    const year = dateObj.getFullYear();
    const day = dateObj.getDate();

    return `${month} ${day}, ${year}`;
}

export function createDateBylineElement(publishedDate, updatedDate) {
    if (isOneWeekSincePublishing(publishedDate, updatedDate)) {
        return createTextElement('p', `Updated: ${createDateString(updatedDate)}`)
    } else {
        return createTextElement('p', `Published: ${createDateString(publishedDate)}`)
    }
}

export function isOneWeekSincePublishing(publishedDate, updatedDate) {
    const oneWeekInMilliseconds = 7*24*60*60*1000;
    const timeDifference = Number(updatedDate) - Number(publishedDate);
    
    if (timeDifference >= oneWeekInMilliseconds) return true;
    return false
}

export function getArticleUrlTitle(articleUrl=location.href) {
    const urlObject = new URL(articleUrl);
    const [ urlTitle ] = urlObject.pathname.match(/(?<=\/articles\/).*/);
    return urlTitle;
}

export function getArticleId(url=location.href) {
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);
    return params.get('id');
}

document.addEventListener('DOMContentLoaded', () => {
    // toggle menu sidebar on phone viewport
    const menuIcon = document.querySelector('nav input');
    const closeDropDownIcon = document.getElementById('close-drop-down');
    const dropDown = document.querySelector('.nav-dropdown');
    if (menuIcon) {
        menuIcon.addEventListener(
            'click', 
            () => toggleElementClass(dropDown, 'hide'))
    }

    if (closeDropDownIcon) {
        closeDropDownIcon.addEventListener(
            'click', 
            () => toggleElementClass(dropDown, 'hide'));
    }
})