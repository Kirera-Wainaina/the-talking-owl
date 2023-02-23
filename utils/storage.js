const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const storage = new Storage({ keyFilename: process.env.SERVICE_ACCOUNT });

exports.saveImage = function(filePath, bucketName=process.env.BUCKET_NAME) {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(path.basename(filePath));

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(file.createWriteStream())
            .on('error', error => reject(error))
            .on('finish', () => resolve(file));
    })
}

exports.getFileMetadata = function(file) {
    return file.getMetadata()
        .then(metadata => metadata[0]);
}

exports.deleteFile = function(name, bucketName=process.env.BUCKET_NAME) {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(name);
    
    return file.delete()
}