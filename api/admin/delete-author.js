const FormDataHandler = require('../../utils/formDataHandler');
const bcrypt = require('bcrypt')

exports.main = async function (request, response) {
    try {
        const [ fields, files ] = await new FormDataHandler(request).run();
        
        if (await isAdminPassword(fields.adminPassword)) {

        } else {
            response.writeHead(403, {'content-type': 'text/plain' });
            response.end('forbidden');
        }
    } catch (error) {
        console.log(error);
        response.writeHead(500, {'content-type': 'text/plain'});
        response.end(error);
    }
}

function isAdminPassword(entry) {
    return bcrypt.compare(entry, process.env.ADMIN_PASSWORD);
}