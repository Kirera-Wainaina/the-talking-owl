const FormDataHandler = require('../utils/formDataHandler');
const responder = require('../utils/responder');
const database = require('../utils/database');
const bcrypt = require('bcrypt');

const adminSignup = require('./admin-signup')


exports.main = async function(request, response) {
    try {
        const [fields] = await new FormDataHandler(request).run();

        const querySnapshot = await database.getUserByEmail(fields.email, 'admins');
        if (querySnapshot.empty) {
            responder.httpResponse(response, 'unauthorized');
            return ;
        }

        querySnapshot.forEach(user => handlePasswordVerification(
                response, 
                user.data(), 
                fields.password))
    } catch (error) {
        console.log(error);
        responder.httpResponse(response, 'error')
    }
}

async function handlePasswordVerification(response, user, plainPassword) {
    if (await isPassword(plainPassword, user.password)) {
        handleSuccessfulLogin(response, user.email)
    } else {
        responder.httpResponse(response, 'unauthorized')
    }
}

function isPassword(plainPassword, hash) {
    return bcrypt.compare(plainPassword, hash)
}

async function handleSuccessfulLogin(response, email) {
    console.log('Successful login');
    const token = await adminSignup.createJWT(email);
    response.setHeader('set-cookie', `auth=${token}; SameSite=Strict; HttpOnly; Path=/`)
    responder.httpResponse(response, 'success')
}