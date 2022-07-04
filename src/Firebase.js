import firebase from 'firebase';
var mode = "test";
var firebaseConfig = {};

 firebaseConfig = {
    apiKey: "AIzaSyCSmHzDSSbxj-XcMLMRZXNRYAfo9EMyJOE",
    authDomain: "loyality-points-a920c.firebaseapp.com",
    projectId: "loyality-points-a920c",
    storageBucket: "loyality-points-a920c.appspot.com",
    messagingSenderId: "238358980447",
    appId: "1:238358980447:web:30bd1e6bcaf740e26038ea"
  };


  const firebaseApp =  firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebaseApp.auth();
  


  export { auth , firebaseApp };
  export default db;