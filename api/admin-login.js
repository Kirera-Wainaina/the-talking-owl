const FormDataHandler = require('../utils/formDataHandler');
const responder = require('../utils/responder');
const database = require('../utils/database')


exports.main = async function(request, response) {
    try {
        const [fields] = await new FormDataHandler(request).run();

        const user = await database.getUserByEmail(fields.email, 'admins');
        if (user.empty) {
            responder.httpResponse(response, 'unauthorized');
            return ;
        }
        console.log(user.size)
        // user.forEach(doc => console.log(doc.data()))
    } catch (error) {
        console.log(error);
        responder.httpResponse(response, 'error')
    }
}