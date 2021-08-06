let googleUserId;
let username;

window.onload = (event) => {
    // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        console.log('Logged in as: ' + user.displayName);
        googleUserId = user.uid;
        getContacts(googleUserId);
        const userRef = firebase.database().ref(`users/${user.uid}`);
        userRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                username = snapshot.val().username;
            }
        });
        } else {
        // If not logged in, navigate back to login page.
        window.location = 'index.html'; 
        };
    });
    // does init.js do this?
    // edit: it does
    // probably should remove this
    // const firebaseConfig = {
    //     apiKey: "AIzaSyC4EcCqzZco5YqASogxwoT0bBOYuxXCr18",
    //     authDomain: "tap-contacts.firebaseapp.com",
    //     databaseURL: "https://tap-contacts-default-rtdb.firebaseio.com",
    //     projectId: "tap-contacts",
    //     storageBucket: "tap-contacts.appspot.com",
    //     messagingSenderId: "472243615275",
    //     appId: "1:472243615275:web:a834966e8aecaf3d139c6e"
    // };
    // firebase.initializeApp(firebaseConfig);
};



const getContacts = (userId) => {
    //console.log(userId)
  //   console.log(userId)
   //  console.log(userId.iud)
  const contactsRef = firebase.database().ref(`users/${userId}`);
  contactsRef.on('value', (snapshot) => {
    const data = snapshot.val();
     //console.log(data);
     username = data.username;
     document.querySelector('#username').innerText = data.username;
     document.querySelector('#fullName').innerText = data.fullName;
     //console.log('frick: ' + data.imageUrl);
     document.querySelector('#profile-pic').src = data.imageUrl;
     document.querySelector(".center-cropped").style = `background-image: url('${data.imageUrl}');`;
    renderDataAsHtml(data.contacts);
  });
};

const renderDataAsHtml = (data) => {
  let cards = ``;
  for(const contactItem in data) {
    const contactInfo = data[contactItem];
    cards += createCard(contactInfo, contactItem)
  };
  document.querySelector('#app').innerHTML = cards;
};

const editContact = (contactId) => {
  const editModal = document.querySelector('#editModal');
  const contactsRef = firebase.database().ref(`users/${googleUserId}/contacts`);
  contactsRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const contactDetails = data[contactId];
    //console.log("checking" + contactDetails)
    document.querySelector('#editId').value = contactId;
    document.querySelector('#editTypeInput').value = contactDetails.type;
    document.querySelector('#editContactInput').value = contactDetails.contact;
  });

  editModal.classList.toggle('is-active');
};

const deleteContact = (contactId) => {
  firebase.database().ref(`users/${googleUserId}/contacts/${contactId}`).remove();
}

const saveEditedNote = () => {
  const contactId = document.querySelector('#editId').value;
  const contactType = document.querySelector('#editTypeInput').value;
  const contactInput = document.querySelector('#editContactInput').value;
  const contactEdits = {
    type: contactType,
    contact: contactInput
  };
  firebase.database().ref(`users/${googleUserId}/contacts/${contactId}`).update(contactEdits);
  closeEditModal();
}

const closeEditModal = () => {
  const editNoteModal = document.querySelector('#editModal');
  editModal.classList.toggle('is-active');
};

const createCard = (info, contactId) => {
  let innerHTML = "";
  innerHTML += `<div class="column is-one-quarter">`
  innerHTML += `<div class="card">`
  innerHTML += `<header class="card-header">`
  innerHTML += `<p class="card-header-title">`
  innerHTML += `${info.type}`
  innerHTML += `</p>`
  innerHTML += `</header>`
  innerHTML += `<div class="card-content">`
  innerHTML += `<div class="content">`
  innerHTML += `${info.contact}`
  innerHTML += `</div>`
  innerHTML += `</div>`
  innerHTML +=  `<footer class="card-footer">`
 innerHTML +=  `<a id="${contactId}" class="card-footer-item" onclick="editContact(this.id)">Edit</a>`
  innerHTML +=  `<a id="${contactId}" href="#" class="card-footer-item" onclick="deleteContact(this.id)">Delete</a>`
  innerHTML +=  `</footer>`
  innerHTML += `</div>`
  innerHTML += `</div>`

  return innerHTML;
};



const inputElement = document.getElementById("input");
inputElement.addEventListener("change", (e) => {
    console.log('heyo');
    const file = inputElement.files[0];
    if(!file.type.startsWith('image/')) return;
    console.log('its an image!');
    // because it's just username.image you could really just take out the whole
    // imageUrl field for each user in the db
    var storageLocation = firebase.storage().ref().child(`${username}.image`);
    storageLocation.put(file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        storageLocation.getDownloadURL().then((url) => {
            const dbRef = firebase.database().ref(`users/${googleUserId}`).update({
                'imageUrl' : url
            }).then((e) => location.reload());
        });
    });
}, false);

const addMoreInfo = () => {
    /**const newModal = document.querySelector('#newModal');
    const contactsRef = firebase.database().ref(`users/${googleUserId}/contacts`);
    contactsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const contactDetails = data[contactId];
        document.querySelector('#newTypeInput').value = contactDetails.type;
        document.querySelector('#newContactInput').value = contactDetails.contact;
    });**/
    newModal.classList.toggle('is-active');
    addContactCheckboxes();
};

const closeNewModal = () => {
  const newModal = document.querySelector('#newModal');
  newModal.classList.toggle('is-active');
};

const saveNew = () => {
    const contactId = document.querySelector('#newId').value;
    const contactType = document.querySelector('#types').value;
    const contactInput = document.querySelector('#newContactInput').value;
    const contactDetails = {
        type: contactType,
        contact: contactInput
    };
    contactsRef = firebase.database().ref(`users/${googleUserId}/contacts/`);
    contactsRef.once('value', (snapshot) => {
        console.log('received data: ');
        contactsRef.update([...snapshot.val(), contactDetails]);
        const checkboxes = document.getElementsByClassName("contactCheckbox");
        console.log(checkboxes);
        let sc = [];
        for (let i = 0; i < checkboxes.length; i++){
            if (checkboxes[i].checked){
                let scRef = firebase.database().ref(`shared-contacts/${checkboxes[i].value}-${username}`);
                console.log(`${checkboxes[i].value}-${username}`);
                scRef.push(contactDetails);
            };
        };
        closeNewModal();
    });

};

const addContactCheckboxes = () => {
    const dbRef = firebase.database().ref('shared-contacts');
    dbRef.on('value',(snapshot) => {
        const data = snapshot.val();
        const contactChecks = document.querySelector("#contactChecks");
        let contactCheckboxesHTML = `<li>`;
        for(let key in data) { 
            if(key.split('-')[0] == username) {
                let theirUsername = key.slice(key.search('-') + 1, key.length);
                contactCheckboxesHTML += `<li><input class="contactCheckbox" type="checkbox" value="${theirUsername}" id="checkbox-${theirUsername}">  <label for="checkbox-${theirUsername}">${key.slice(key.search('-') + 1, key.length)}</label></li>`
            }
        };
        contactChecks.innerHTML = contactCheckboxesHTML;   
    });
};               

