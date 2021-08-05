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
    const contactsRef = firebase.database().ref(`users/${userId}/contacts`);
    contactsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        renderDataAsHtml(data);
  });
};

const renderDataAsHtml = (data) => {
    let cards = `<ul>`;
    for(const contactItem in data) {
        const contactInfo = data[contactItem];
       // cards += `<li><input type="checkbox" class = "checkboxes" id="${contactInfo.type}" name="${contactInfo.contact}" value="${contactInfo.type}"><label for="${contactInfo.type}"> ${contactInfo.type}: ${contactInfo.contact}</label><br></li>`    
   cards+= `<li><div class="card my-5">
                <div class="card-content columns is-mobile is-vcentered is-flex-direction-row">
                    <div class="column is-3-mobile is-3-desktop">
                    </div>
                    <div class="column is-9 is-8-mobile">
                    <input type="checkbox" class = "checkboxes" id="${contactInfo.type}" name="${contactInfo.contact}" value="${contactInfo.type}"><label for="${contactInfo.type}"> ${contactInfo.type}: ${contactInfo.contact}</label><br>
                       
                    </div>
                    <div class="column is-1-desktop"></div>
                    <div class="column is-1 is-1-mobile">
                        
                    </div>
                </div>
            </div>
            </li>`
    };
    // <h3 class="subtitle">${contactInfo.type}: ${contactInfo.contact}</h3>
    cards += `</ul>`
  document.querySelector('#app').innerHTML = cards;
};


const addInfo = () => {
    newContact = document.querySelector("#newContact-input").value
    const userRef = firebase.database().ref(`users/${googleUserId}`);
    userRef.on('value', (snapshot) => {
        let username = snapshot.val().username;
        saveString = `${newContact}-${username}`;
        const dbRef = firebase.database().ref(`shared-contacts`);
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

