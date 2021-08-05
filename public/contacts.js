// first get their username with their google account
let googleUser;
let myUsername;

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
            // da global var
            myUsername = username;
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
    navigator.geolocation.getCurrentPosition((e) => {
        console.log('e: ');
        console.log(e);
        const userRef = firebase.database().ref(`location/${myUsername}`);
        userRef.set([e.coords.latitude, e.coords.longitude, new Date().toISOString()]).then((_) => {
            console.log('done');
            const othersRef = firebase.database().ref(`location/`);
            othersRef.on('value', (snapshot) => {
                let data = snapshot.val();
                for(let key in data) {
                    console.log('key: ' + key);
                    console.log(data);
                    console.log(calcCrow(e.coords.latitude, e.coords.longitude, data[key][0], data[key][1]));
                    console.log(Date.parse(data[key][2]));
                    console.log(Date.parse(new Date().toISOString()));
                    // check to see they are within 0.5 km and tapped the location button less than a minute ago and it wasn't from your username
                    if(calcCrow(e.coords.latitude, e.coords.longitude, data[key][0], data[key][1]) < 0.5 && Math.abs(Date.parse(new Date().toISOString()) - Date.parse(data[key][2]) < 60000) && key != myUsername) {
                        if(confirm(`Would you like to add ${key} as a contact?`)) window.location.href = `/view-contact.html?username=${key}`;
                    }
                }
            });            
        });
        
    });
  } else {
    return false;
  }
}

// thank you, derek
function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // radius of the earth
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

function toRad(Value) {
    return Value * Math.PI / 180;
}