const bcrypt = require('bcrypt')
const FormDataHandler = require('../utils/formDataHandler');
const dotenv = require('dotenv');
dotenv.config()

module.exports = async function(request, response) {
    const [fields, files] = await new FormDataHandler(request).run();

    if (!await isAdminPassword(fields['adminPassword'])) {
        
    }
    console.log('fields: ', fields)
    console.log('files', files);
}

function isAdminPassword(entry) {
    return bcrypt.is(entry, process.env.ADMIN_PASSWORD);
}

exports.isAdminPassword = isAdminPassword;