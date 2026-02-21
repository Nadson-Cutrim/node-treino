const admin = require('firebase-admin');
const serviceAccount = require('./node-test-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://'});
 
  const db = admin.firestore();
  module.exports = db;

