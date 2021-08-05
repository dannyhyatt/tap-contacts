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
    let cards = ``;
    for(const contactItem in data) {
        const contactInfo = data[contactItem];
       // cards += `<li><input type="checkbox" class = "checkboxes" id="${contactInfo.type}" name="${contactInfo.contact}" value="${contactInfo.type}"><label for="${contactInfo.type}"> ${contactInfo.type}: ${contactInfo.contact}</label><br></li>`    
   cards+= `<label for="${contactInfo.type}" class="column is-half-tablet is-one-third-desktop is-12-mobile">
                <div class="card my-5 mr-2">
                    <div class="card-content columns is-mobile is-vcentered is-flex-direction-row">
                        <div class="column is-3-mobile is-3-desktop">
                            <figure class="image is-64x64">
                                <div class="center-cropped" id="contacts-profile-pic" style="background-image: url('https://www.personality-insights.com/wp-content/uploads/2017/12/default-profile-pic-e1513291410505.jpg');">
                                    <img class="is-rounded" id="profile-pic" src="https://www.personality-insights.com/wp-content/uploads/2017/12/default-profile-pic-e1513291410505.jpg">
                                </div>
                            </figure>
                        </div>
                        <div class="column is-6 is-7-mobile" style="text-align: left">
                        <b>${contactInfo.type}:</b><br>
                        ${contactInfo.contact}<br>
                        
                        </div>
                        <div class="column is-2" style="margin-left: auto; margin-right: 1em;">
                            <span class="checkbox-container">
                                <input type="checkbox" class="checkboxes" id="${contactInfo.type}" name="${contactInfo.contact}" value="${contactInfo.type}">
                                <div class="checkbox-img"></div>
                            </span>
                        </div>
                    </div>
                </div>
            </label>`
    };
    // <h3 class="subtitle">${contactInfo.type}: ${contactInfo.contact}</h3>
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

