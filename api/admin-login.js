const FormDataHandler = require('../utils/formDataHandler');
const responder = require('../utils/responder');
const database = require('../utils/database');
const bcrypt = require('bcrypt');


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
                user.data().password, 
                fields.password))
    } catch (error) {
        console.log(error);
        responder.httpResponse(response, 'error')
    }
}

async function handlePasswordVerification(response, hash, plainPassword) {
    if (await isPassword(plainPassword, hash)) {
        responder.httpResponse(response, 'success')
    } else {
        responder.httpResponse(response, 'unauthorized')
    }
}

function isPassword(plainPassword, hash) {
    return bcrypt.compare(plainPassword, hash)
}