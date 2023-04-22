const FormDataHandler = require('../../utils/formDataHandler');
const storage = require('../../utils/storage');
const imageHandler = require('../../utils/imageHandler');
const bcrypt = require('bcrypt');
const fsPromises = require('fs/promises');

exports.main = async function (request, response) {
    try {
        const [fields, files] = await new FormDataHandler(request).run();
        if (await isAdminPassword(fields.adminPassword)) {
            const [ convertedImageMetadata ] = await imageHandler.minimizeImage(files[0]);
            console.log(convertedImageMetadata);
            const cloudFile = await storage.saveImage(convertedImageMetadata.destinationPath);
            const cloudImageMetadata = await storage.getFileMetadata(cloudFile);
            const dataToSave = createDataToSave(fields, cloudImageMetadata);
            console.log(fields);
            console.log(dataToSave);

        } else {
            await fsPromises.unlink(files[0])
            response.writeHead(403, {'content-type': 'text/html' });
            response.end('forbidden');
        }

    } catch (error) {
        console.log(error);
        response.writeHead(500, { 'content-type': 'text/html'});
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