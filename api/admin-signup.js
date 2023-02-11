const bcrypt = require('bcrypt')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
const utilities = require('util')

const FormDataHandler = require('../utils/formDataHandler');
const responder = require('../utils/responder');
const database = require('../utils/database')
dotenv.config()

exports.main = async function(request, response) {
    try {
        const [fields] = await new FormDataHandler(request).run();

        if (!await isAdminPassword(fields['adminPassword'])) {
            responder.httpResponse(response, 'unauthorized');
            return
        }
        const data = await createDataToSave(fields)
        const ref = await database.saveData(data, 'admins');
        if (ref.id) {
            console.log('Admin account created successfully')
            const token = await createJWT(fields.email);
            response.setHeader('set-cookie', `auth=${token}; SameSite=Strict; HttpOnly; Path=/`)
            responder.httpResponse(response, 'success');
        }
    } catch (e) {
        responder.httpResponse(response, 'error')
    }
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

function createJWT(email) {
    const sign = utilities.promisify(jwt.sign)
    return sign({'email': email}, process.env.ADMIN_PASSWORD);
}

exports.createDataToSave = createDataToSave;