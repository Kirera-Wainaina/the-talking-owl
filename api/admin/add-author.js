const FormDataHandler = require('../../utils/formDataHandler');
const storage = require('../../utils/storage');
const imageHandler = require('../../utils/imageHandler');
const bcrypt = require('bcrypt');
const fsPromises = require('fs/promises');

exports.main = async function (request, response) {
    try {
        const [fields, files] = await new FormDataHandler(request).run();
        if (await isAdminPassword(fields.adminPassword)) {
            console.log(files);
            console.log(files);
        } else {
            await fsPromises.unlink(files[0])
            response.writeHead(403, {'content-type': 'text/html' });
            response.end('forbidden');
        }

    } catch (error) {
        console.log(error);
        await fsPromises.unlink(files[0])
        response.writeHead(500, { 'content-type': 'text/html'});
        response.end('error')
    }
}

function isAdminPassword(entry) {
    return bcrypt.compare(entry, process.env.ADMIN_PASSWORD);
}

function createDataObject(fields, metadata) {
    delete fileNumber;
    delete adminPassword;
    return {
        ...fields,
        profileImageName: metadata.name,
        profileImageLink: metadata.mediaLink
    }
}