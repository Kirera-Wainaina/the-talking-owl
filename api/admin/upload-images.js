const FormDataHandler = require('../../utils/formDataHandler');
const storage = require('../../utils/storage');
const database = require('../../utils/database')
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const path = require('path');
const fsPromises = require('fs/promises');
const { Timestamp } = require('@google-cloud/firestore');

exports.main = async function(request, response) {
    try {
        const [fields, files] = await new FormDataHandler(request).run();
        const convertedFileMetadata = await Promise.all(files.map(filePath => minimizeImage(filePath)));

        const cloudFiles = await Promise.all(convertedFileMetadata.map(
            filePath => storage.saveImage(filePath[0].destinationPath)));

        await Promise.all(convertedFileMetadata.map(
            async metadata => await Promise.all([deleteImage(metadata[0].destinationPath), 
                                                deleteImage(metadata[0].sourcePath)])));

        const metadata = await Promise.all(cloudFiles.map(file => storage.getFileMetadata(file)));

        await Promise.all(metadata.map(
            info => database.saveData(createImageData(info), 'images')))
        
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

function createImageData(metadata) {
    return {
        name: metadata.name,
        link: metadata.mediaLink,
        createTime: Timestamp.now()
    }
}