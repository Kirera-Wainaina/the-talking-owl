const FormDataHandler = require('../../utils/formDataHandler');
const storage = require('../../utils/storage');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const path = require('path');

exports.main = async function(request, response) {
    const [fields, files] = await new FormDataHandler(request).run();
    const convertedFilePaths = await Promise.all(files.map(filePath => minimizeImage(filePath)));
    await Promise.all(convertedFilePaths.map(filePath => storage.saveImage(filePath[0].destinationPath)))
    console.log('done')
}

function minimizeImage(filePath) {
    const destination = path.join(path.dirname(path.dirname(__dirname)), 'converted');

    return imagemin([filePath], {
        destination,
        plugins: [imageminWebp({quality: 70})]
    })
}