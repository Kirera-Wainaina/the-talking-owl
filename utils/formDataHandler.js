const busboy = require('busboy');
const mimes = require('./MIMETypes')

class FormDataHandler {
    constructor(request) {
        this.request = request;
        this.fields = {};
        this.uploadedFiles = []
        this.thereIsFile = false;
        this.fileNumber = 0;
    }

    retrieveDetails() {
        return new Promise((resolve, reject) => {
            const bus = busboy({ headers: this.request.headers });
            bus.on('field', (name, value) => this.handleField(name, value));
            bus.on('file', 
                    (name, file, info) => this.handleFile(name, file, info, resolve));
            bus.on('close', () => this.handleClose(resolve))
            
            this.request.pipe(bus);

        })
    }

    handleField(name, value) {
        this.fields[name] = value;
    }

    handleFile(name, file, info, resolve) {
        this.thereIsFile = true;
        const ext = mimes.findExtensionFromMIMEType(info.mimeType);
        const filePath = path.join(path.dirname(__dirname), 'uploaded', `${name}${ext}`);

        file.pipe(fs.createWriteStream(filePath))
            .on('finish', () => this.handleFileSaved(name, resolve))
    }

    handleClose(resolve) {
        if (!this.thereIsFile) resolve();
        console.log('Data retrieved successfully');
    }

    handleFileSaved(name, resolve) {
        console.log(`${name} written to disk`);
        this.fileNumber += 1;
        this.uploadedFiles.push(filePath);
        if (this.fileNumber == this.fields.fileNumber) resolve()
    }

    run() {
        return new Promise((resolve, reject) => {
            this.retrieveDetails()
                .then(() => resolve([this.fields, this.uploadedFiles]))
                .catch(error => reject(error))
        })
    }
}

module.exports = FormDataHandler;