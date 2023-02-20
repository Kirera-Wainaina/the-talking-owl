const FormDataHandler = require('../../utils/formDataHandler');
const storage = require('../../utils/storage');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const path = require('path');
const fsPromises = require('fs/promises');

exports.main = async function(request, response) {
    try {
        const [fields, files] = await new FormDataHandler(request).run();
        const convertedFileMetadata = await Promise.all(files.map(filePath => minimizeImage(filePath)));

        await Promise.all(convertedFileMetadata.map(
            filePath => storage.saveImage(filePath[0].destinationPath)));

        await Promise.all(convertedFileMetadata.map(
            async metadata => await Promise.all([deleteImage(metadata[0].destinationPath), 
                                                deleteImage(metadata[0].sourcePath)])));
        
        response.writeHead(200, {'content-type': 'text/plain'})
            .end('success')
    } catch (error) {
        console.log(error);
        response.writeHead(500, {'content-type': 'text/plain'})
            .end('error')
    }
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