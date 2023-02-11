const FormDataHandler = require('../utils/formDataHandler');
const responder = require('../utils/responder');
const database = require('../utils/database')


exports.main = async function(request, response) {
    try {
        const [fields] = await new FormDataHandler(request).run()
        console.log(fields)
    } catch (error) {
        responder.httpResponse(response, 'error')
    }
}