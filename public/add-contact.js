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
};;

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
  let cards = `<li>`;
  for(const contactItem in data) {
    const contactInfo = data[contactItem];
    // `<ul> ${contactInfo.type}:  ${contactInfo.contact}</ul>`
    // For each note create an HTML card
    cards += 
`<input type="checkbox" class = "checkboxes" id="${contactInfo.type}" name="${contactInfo.contact}" value="${contactInfo.type}">
<label for="${contactInfo.type}"> ${contactInfo.type}</label><br></br>`    
   //  cards += `<ul> ${contactInfo.contact} </ul>`
  };
  // Inject our string of HTML into our viewNotes.html page
   cards += `</li>`
  document.querySelector('#app').innerHTML = cards;
};


const addInfo = () => {
    newContact = document.querySelector("#newContact-input").value
     const userRef = firebase.database().ref(`users/${googleUserId}`);
      userRef.on('value', (snapshot) => {
       
            let username = snapshot.val().username;
             saveString = `${username}-${newContact}`
    console.log(saveString)
        
    
  const dbRef = firebase.database().ref(`shared-contacts`);
   // let dropdowns = document.querySelectorAll(".dropdowns");
    let checkboxes = document.querySelectorAll(".checkboxes");
    let info = [];
    for (let i = 0; i < checkboxes.length; i++){
        if (checkboxes[i].checked){
        info.push({
            type: checkboxes[i].value, 
            contact: checkboxes[i].name
        });
    };
    }
    console.log(info);
    let obj = {};
    obj [saveString] = info
    dbRef.update(obj).then( () => {
        window.location = 'contacts.html'; 
    });
    }
      )
};
//newContact = document.querySelector("#newContact-input").value

