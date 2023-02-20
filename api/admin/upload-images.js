const FormDataHandler = require('../../utils/formDataHandler');
const storage = require('../../utils/storage');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const path = require('path');
const fsPromises = require('fs/promises');

exports.main = async function(request, response) {
    const [fields, files] = await new FormDataHandler(request).run();
    const convertedFileMetadata = await Promise.all(files.map(filePath => minimizeImage(filePath)));
    
    await Promise.all(convertedFileMetadata.map(
        filePath => storage.saveImage(filePath[0].destinationPath)));

    await Promise.all(convertedFileMetadata.map(
        async metadata => await Promise.all([deleteImage(metadata[0].destinationPath), 
                                            deleteImage(metadata[0].sourcePath)])));
    console.log('done')
}

function minimizeImage(filePath) {
    const destination = path.join(path.dirname(path.dirname(__dirname)), 'converted');

    return imagemin([filePath], {
        destination,
        plugins: [imageminWebp({quality: 70})]
    })
}

function deleteImage(filePath) {
    return fsPromises.unlink(filePath);
}