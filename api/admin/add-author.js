const FormDataHandler = require('../../utils/formDataHandler');
const storage = require('../../utils/storage');
const imageHandler = require('../../utils/imageHandler');
const database = require('../../utils/database');
const bcrypt = require('bcrypt');
const fsPromises = require('fs/promises');

exports.main = async function (request, response) {
    try {
        const [fields, files] = await new FormDataHandler(request).run();
        if (await isAdminPassword(fields.adminPassword)) {
            const [ convertedImageMetadata ] = await imageHandler.minimizeImage(files[0]);
            const cloudFile = await storage.saveImage(convertedImageMetadata.destinationPath);
            const cloudImageMetadata = await storage.getFileMetadata(cloudFile);
            const dataToSave = createDataToSave(fields, cloudImageMetadata);
            await Promise.all([
                fsPromises.unlink(convertedImageMetadata.sourcePath),
                fsPromises.unlink(convertedImageMetadata.destinationPath)
            ])
            const documentRef = await database.saveData(dataToSave, 'authors');

            if (documentRef.id) {
                console.log('successfully saved author');
                response.writeHead(200, {'content-type': 'text/plain'})
                response.end('success')
            } else {
                throw new Error('Error while saving to Firestore');
            }

        } else {
            await fsPromises.unlink(files[0])
            response.writeHead(403, {'content-type': 'text/plain' });
            response.end('forbidden');
        }

    } catch (error) {
        console.log(error);
        response.writeHead(500, { 'content-type': 'text/plain'});
        response.end('error')
    }
}

function isAdminPassword(entry) {
    return bcrypt.compare(entry, process.env.ADMIN_PASSWORD);
}

function createDataToSave(fields, metadata) {
    delete fields.fileNumber;
    delete fields.adminPassword;
    return {
        ...fields,
        profileImageName: metadata.name,
        profileImageLink: metadata.mediaLink
    }
}