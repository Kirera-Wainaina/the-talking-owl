const FormDataHandler = require('../../utils/formDataHandler');
const storage = require('../../utils/storage');
const imageHandler = require('../../utils/imageHandler');
const fsPromises = require('fs/promises');
const bcrypt = require('bcrypt')

exports.main = async function (request, response) {
    try {
        const [fields, files ] = await new FormDataHandler(request).run();
        if (await isAdminPassword(fields.adminPassword)){
            let cloudFileMetadata;
            if (files.length) {
                const [ convertedFileMetadata ] = await imageHandler.minimizeImage(files[0]);
                const cloudFile = await storage.saveImage(convertedFileMetadata.destinationPath);
                cloudFileMetadata = await storage.getFileMetadata(cloudFile);
                console.log(cloudFileMetadata)
            }
            const dataToSave = createDataToSave(fields, cloudFileMetadata);
            console.log(dataToSave);
        // carry out the rest of the process here not in if statement
        } else {
            if (files.length) {
                await fsPromises.unlink(files[0])
            }
            response.writeHead(403, {'content-type': 'text/plain' });
            response.end('forbidden');
        }
    } catch (error) {
        console.log(error);
        response.writeHead(500, { 'content-type': 'text/plain' })
        response.end('error')
    }
}

function isAdminPassword(entry) {
    return bcrypt.compare(entry, process.env.ADMIN_PASSWORD);
}

function createDataToSave(fields, cloudFileMetadata) {
    delete fields.adminPassword;
    delete fields.fileNumber;

    if (cloudFileMetadata) {
        return {
            ...fields,
            profileImageLink: cloudFileMetadata.mediaLink,
            profileImageName: cloudFileMetadata.name 
        }
    }
    return fields
}