const FormDataHandler = require('../../utils/formDataHandler');

exports.main = async function(request, response) {
    const [fields, files] = await new FormDataHandler(request).run();
    console.log(files)
}
