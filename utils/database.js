const { Firestore } = require('@google-cloud/firestore');
const dotenv = require('dotenv');

dotenv.config()

const firestore = new Firestore({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.SERVICE_ACCOUNT
});

exports.saveData = function(data, collectionName) {
    const collection = firestore.collection(collectionName);
    return collection.add(data)
}

exports.getUserByEmail = function(email, collectionName) {
    const collection = firestore.collection(collectionName);
    return collection.where('email', '==', email).limit(1).get()
}