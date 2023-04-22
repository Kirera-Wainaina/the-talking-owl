const FormDataHandler = require('../../utils/formDataHandler');
const storage = require('../../utils/storage');
const imageHandler = require('../../utils/imageHandler');

exports.main = async function (request, response) {
    try {
        const [fields, files ] = await new FormDataHandler(request).run();
        
        if (files.length) {
            const [ convertedFileMetadata ] = await imageHandler.minimizeImage(files[0]);
            const cloudFile = await storage.saveImage(convertedFileMetadata.destinationPath);
            const cloudFileMetadata = await storage.getFileMetadata(cloudFile);
            console.log(cloudFileMetadata)
        }
        // carry out the rest of the process here not in if statement
        console.log(fields, files);
    } catch (error) {
        console.log(error);
        response.writeHead(500, { 'content-type': 'text/plain' })
        response.end('error')
    }
}