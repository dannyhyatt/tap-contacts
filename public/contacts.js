// first get their username with their google account
let googleUser;

let contacts = {};

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      const userRef = firebase.database().ref(`users/${user.uid}`);
      userRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            let username = snapshot.val().username;
            console.log('username: ' + username);
            const contactsRef = firebase.database().ref(`shared-contacts/`);
            contactsRef.on('value', (snapshot) => {
                let data = snapshot.val();
                for(let key in data) {
                    if(key.split('-')[0] == username) {
                        if(contacts[key] == undefined) {
                            contacts[key] = {};
                        }
                        contacts[key]['isSharing'] = data[key];
                    } else if(key.split('-')[1] == username) {
                        if(contacts[key] == null) contacts[key] = {};
                        contacts[key]['sharedContactsWithMe'] = data[key];
                    }
                }
                console.log(contacts);
            });
        }
        else {
            window.location = "create-account.html";
        }
      });
    } else {
      window.location = 'index.html'; 
    };
  });
};


const createCard = () => {
    return 
        `<div class="card my-5">
            <div class="card-content columns is-vcentered is-flex-direction-row">
                <div class="column is-2-mobile is-1-desktop">
                    <figure class="image is-64x64">
                        <img class="is-rounded" src="${imgUrl}">
                    </figure>
                </div>
                <div class="column is-9 is-9-mobile">
                    <h3 class="subtitle">${username}</h3>
                </div>
                <div class="column is-1-desktop"></div>
                <div class="column is-1 is-1-mobile">
                    <p class="has-text-centered subtitle"> &#62; </p>
                </div>
            </div>
        </div>`;
}