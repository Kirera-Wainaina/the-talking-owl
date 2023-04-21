const FormDataHandler = require('../../utils/formDataHandler');
const storage = require('../../utils/storage');

exports.main = async function (request, response) {
    try {
        const [fields, files] = await new FormDataHandler(request).run();
        if (await isAdminPassword(fields.adminPassword)) {
            console.log(files)
            console.log(fields)
            const cloudFile = await storage.saveImage(files[0]);
            const metadata = await storage.getFileMetadata(cloudFile);                
        } else {
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