let googleUserId;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getContacts(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};



const getContacts = (userId) => {
    console.log(userId)
  //   console.log(userId)
   //  console.log(userId.iud)
  const contactsRef = firebase.database().ref(`users/${userId}/contacts`);
  contactsRef.on('value', (snapshot) => {
    const data = snapshot.val();
     console.log(data);
    renderDataAsHtml(data);
  });
};

const renderDataAsHtml = (data) => {
  let cards = ``;
  for(const contactItem in data) {
    const contactInfo = data[contactItem];
    // For each note create an HTML card
    cards += createCard(contactInfo, contactItem)
  };
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
};

const editContact = (contactId) => {
  const editNoteModal = document.querySelector('#editNoteModal');
  const contactsRef = firebase.database().ref(`users/${googleUserId}/contacts`);
  contactsRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const noteDetails = data[contactId];
     console.log("checking" + noteDetails)
    document.querySelector('#editNoteId').value = contactId;
    document.querySelector('#editTitleInput').value = noteDetails.type;
    document.querySelector('#editTextInput').value = noteDetails.contact;
  });

  editNoteModal.classList.toggle('is-active');
};

const deleteContact = (contactId) => {
  firebase.database().ref(`users/${googleUserId}/contacts/${contactId}`).remove();
}

const saveEditedNote = () => {
  const noteId = document.querySelector('#editNoteId').value;
  const noteTitle = document.querySelector('#editTitleInput').value;
  const noteText = document.querySelector('#editTextInput').value;
  const noteEdits = {
    type: noteTitle,
    contact: noteText
  };
  firebase.database().ref(`users/${googleUserId}/contacts/${noteId}`).update(noteEdits);
  closeEditModal();
}

const closeEditModal = () => {
  const editNoteModal = document.querySelector('#editNoteModal');
  editNoteModal.classList.toggle('is-active');
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

