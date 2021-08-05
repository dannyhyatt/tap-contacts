// first get their username with their google account
let googleUser;

let contacts = {};
let contactUsernames = [];
let contactProfiles = [];

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      const userRef = firebase.database().ref(`users/${user.uid}`);
      userRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();
            let username = data.username;
            console.log('username: ' + username);
            document.querySelector('#profile-pic').src = data.imageUrl;
            const contactsRef = firebase.database().ref(`shared-contacts/`);
            contactsRef.on('value', (snapshot) => {
                let data = snapshot.val();
                for(let key in data) {
                    if(key.split('-')[0] == username) {
                        // username comes first in local key so don't change it
                        if(contacts[key] == undefined) {
                            contacts[key] = {};
                        }
                        contacts[key]['isSharing'] = data[key];
                    } else if(key.split('-')[1] == username) {
                        // change it so the username comes first in this key
                        key = key.split('-').reverse().join('-');
                        if(contacts[key] == null) contacts[key] = {};
                        contacts[key]['sharedContactsWithMe'] = data[key];
                    }
                }
                console.log(contacts);

                // now, fetch the usernames of all the people who you are sharing contacts with
                // and everyone who is sharing contacts with you
                for(let key in contacts) contactUsernames.push(key.split('-')[1]);
                console.log(contactUsernames);

                const usersRef = firebase.database().ref(`users/`);
                usersRef.on('value', (snapshot) => {
                    let cardsHTML = '';
                    let data = snapshot.val();
                    for(let key in data) {
                        console.log(data[key].username);
                        if(contactUsernames.includes(data[key].username)) {
                            cardsHTML += createCard(data[key]);
                        }
                    }
                    
                    document.querySelector('#cards-container').innerHTML = cardsHTML;
                    console.log(cardsHTML)
                    if (cardsHTML == ''){
                        console.log("here")
                        document.querySelector('#no-contacts').innerHTML = `<h2> Add Some Contacts to see their information! </h2>`;
                    }
                });
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


const createCard = (user) => {
    console.log('received data: ');
    console.log(user);
    return `<a href="/view-contact.html?username=${user.username}">
            <div class="card my-5">
                <div class="card-content columns is-mobile is-vcentered is-flex-direction-row">
                    <div class="column is-3-mobile is-1-desktop">
                        <figure class="image is-64x64">
                            <img class="is-rounded" src="${user.imageUrl}">
                        </figure>
                    </div>
                    <div class="column is-9 is-8-mobile">
                        <h3 class="subtitle">${user.fullName}</h3>
                    </div>
                    <div class="column is-1-desktop"></div>
                    <div class="column is-1 is-1-mobile">
                        <p class="has-text-centered subtitle"> &#62; </p>
                    </div>
                </div>
            </div>
        </a>`;
}

const searchNearby = () => {
    const location = getLocation();
    if(location == false) {
        alert('You need to allow location services or use a device that is capable of determining your location for this feature.');
        return;
    }

    
}

// thank you, w3schools
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    return false;
  }
}
