const bcrypt = require('bcrypt')
const dotenv = require('dotenv');

const FormDataHandler = require('../utils/formDataHandler');
const responder = require('../utils/responder')
dotenv.config()

module.exports = async function(request, response) {
    const [fields, files] = await new FormDataHandler(request).run();

    if (!await isAdminPassword(fields['adminPassword'])) {
        responder.httpResponse(response, 'unauthorized');
        return
    }
}

function isAdminPassword(entry) {
    return bcrypt.compare(entry, process.env.ADMIN_PASSWORD);
}

exports.isAdminPassword = isAdminPassword;