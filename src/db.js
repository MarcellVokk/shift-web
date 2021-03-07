import firebase from "firebase/app";
import "firebase/database";

const config = {
    apiKey: "AIzaSyCzDev4qFH8nSxFaI6PbxAzqLIvXl6-vK0",
    authDomain: "shift-web-b62b4.firebaseapp.com",
    projectId: "shift-web-b62b4",
    storageBucket: "shift-web-b62b4.appspot.com",
    messagingSenderId: "73517470321",
    appId: "1:73517470321:web:42b65ce5f18b6177cf81d0"
}

const db = firebase.initializeApp(config);
export default db;