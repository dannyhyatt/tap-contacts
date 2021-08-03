// first get their username with their google account
let googleUser;
let username; 

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      const userRef = firebase.database().ref(`users/${user.uid}`);
      userRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            username = snapshot.val().username;
            console.log('username: ' + username);
            showContact();
        }
        else {
            window.location = "create-account.html";
        }
      });
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};



const showContact = () => {
    const contactName = (new URL(window.location.href)).searchParams.get('username');
    const dbRef = firebase.database().ref(`shared-contacts/${username}-${contactName}`);
    const contactInfo = document.querySelector("#contact-info");
    changeName(contactName);
    dbRef.on('value', (snapshot) => {
    const data = snapshot.val();
    for (let key in data) {
        let newContact = data[key].contact + "<br>" + showLink(data[key].type,data[key].contact);
         contactInfo.innerHTML += createCard(data[key].type,newContact);
    };
  });
};

const createCard = (type,contact) => {
    return `<div class="column is-one-quarter">
                <div class="card"> 
                    <header class="card-header"> 
                        <p class="card-header-title"> 
                            ${type} 
                        </p> 
                    </header> 
                    <div class="card-content"> 
                        <div class="content">
                            ${contact} 
                        </div>
                    </div> 
                </div>
            </div>`;
};

const changeName = (contactName) => {
    const name = document.querySelector("#contactName");
    name.innerHTML = `${contactName}'s Contact Information`;
};

const showLink = (type,contact) => {
    let link;
    if(type == "Snapchat"){
        link = 'http://www.snapchat.com/add/';
    }
    else if(type == "Instagram"){
        link = "http://instagram.com/"
    }
    else if(type == 'LinkedIn'){
        link = "http://linkedin.com/in/"
    }
    else {
        return '';
    }
    if (link) {
        return `<a href=${link}${contact}>${type}</a>`;
    }
};