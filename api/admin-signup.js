const bcrypt = require('bcrypt')
const dotenv = require('dotenv');

const FormDataHandler = require('../utils/formDataHandler');
const responder = require('../utils/responder');
const database = require('../utils/database')
dotenv.config()

exports.main = async function(request, response) {
    const [fields] = await new FormDataHandler(request).run();

    if (!await isAdminPassword(fields['adminPassword'])) {
        responder.httpResponse(response, 'unauthorized');
        return
    }

    createDataToSave(fields)
}

function isAdminPassword(entry) {
    return bcrypt.compare(entry, process.env.ADMIN_PASSWORD);
}

async function createDataToSave(fields) {
    return {
        email: fields.email,
        firstName: fields.firstName,
        password: await hashPassword(fields.password)
    }
}

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 12)
            .then(result => resolve(result))
            .catch(error => reject(error))
    })
}

exports.createDataToSave = createDataToSave;