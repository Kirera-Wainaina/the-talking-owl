const FormDataHandler = require('../../utils/formDataHandler');
const database = require('../../utils/database');
const storage = require('../../utils/storage');
const bcrypt = require('bcrypt');

exports.main = async function (request, response) {
    try {
        const [fields] = await new FormDataHandler(request).run();
        
        if (await isAdminPassword(fields.adminPassword)) {
            const authorDetails = await database.getDocumentData(fields.authorId, 'authors');
            await storage.deleteFile(authorDetails.profileImageName);
            const writeResult = await database.deleteDocument(fields.authorId, 'authors');

            if (writeResult.writeTime) {
                console.log('Author deletion was a success');
                response.writeHead(200, {'content-type': 'text/plain'})
                response.end('success')
            } else {
                throw new Error('Error while deleting document')
            }
        } else {
            response.writeHead(403, {'content-type': 'text/plain' });
            response.end('forbidden');
        }
    } catch (error) {
        console.log(error);
        response.writeHead(500, {'content-type': 'text/plain'});
        response.end('error');
    }
}

function isAdminPassword(entry) {
    return bcrypt.compare(entry, process.env.ADMIN_PASSWORD);
}