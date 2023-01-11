const firebase = require("firebase-admin");

const serviceAccount = require("./mykidsschool-e3534-firebase-adminsdk-4l1kw-84e3d85e24.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

module.exports = firebase;
