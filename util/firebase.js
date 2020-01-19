import firebase from 'firebase';
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyBLbYQbkIj43egvHetTe_iJQdBW3j4I2yI",
        authDomain: "zipforce-f6757.firebaseapp.com",
        databaseURL: "https://zipforce-f6757.firebaseio.com",
        projectId: "zipforce-f6757",
        storageBucket: "zipforce-f6757.appspot.com",
        messagingSenderId: "860845496853",
        appId: "1:860845496853:web:42997c2f1820dba7fb0c1c"
    })
}

export default firebase;