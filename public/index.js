firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then((e) => console.log('set persistent cache'));

const signIn = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  // console.log(provider)
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    var token = credential.accessToken;

    // The signed-in user info.
    var user = result.user;
    const dbRef = firebase.database().ref(`users/${user.uid}`);
    dbRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            window.location = "contacts.html";
        }
        else {
            window.location = "create-account.html";
        }
    });
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    const err = {
      errorCode,
      errorMessage,
      email,
      credential
    };
    console.log(err);
  });
}



