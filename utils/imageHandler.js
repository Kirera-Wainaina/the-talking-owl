const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const path = require('path');

function minimizeImage(filePath) {
    const destination = path.join(__dirname, '..', 'converted');
    console.log('destination: ', destination)
    console.log('filePath: ', filePath)

    return imagemin([filePath], {
        destination,
        plugins: [imageminWebp({quality: 70})]
    })
}

exports.minimizeImage = minimizeImage;