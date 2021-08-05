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
            let data = snapshot.val();
            username = data.username;
            console.log('username: ' + username);
            document.querySelector('#profile-pic').src = data.imageUrl;
            document.querySelector("#contacts-profile-pic").style = `background-image: url('${data.imageUrl}');`;
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
    if (snapshot.exists()) {
        const data = snapshot.val();
        for (let key in data) {
            let newContact = showLink(data[key].type,data[key].contact);
            contactInfo.innerHTML += createCard(data[key].type,newContact);
        }
    }
    else {
        const addContactBtn = document.querySelector("#btn");
        addContactBtn.classList.remove("hidden");
    } 
  });
};

const addContact = () => {
    const contactName = (new URL(window.location.href)).searchParams.get('username');
    const userRef = firebase.database().ref('users');

    let contact = [];
    
    userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        for (let key in data){
            if(data[key].username == contactName) {
                for (let i in data[key].contacts){
                    console.log(data[key].contacts[i]);
                    contact.push({
                        contact: data[key].contacts[i].contact,
                        type: data[key].contacts[i].type
                    });
                };    
            };
        }
        const contactInfo = {};
        contactInfo[`${username}-${contactName}`] = contact;
        console.log(contactInfo);
        const dbRef = firebase.database().ref('shared-contacts/');
        dbRef.update(contactInfo);
        document.querySelector("#btn").classList.add("hidden");

    });
    
    
    
};


const createCard = (type,contact) => {
    return `<div class="column is-one-quarter is-12-mobile">
                <div class="card"> 
                    <div class="card-content">
                        <div class="content" style="display: flex; flex-direction: row; align-items: center;">
                            <img src="${addIcon(type)}" style="display:inline; width: 2rem; height: 2rem" class="mr-2"> ${contact} 
                        </div>
                    </div> 
                </div>
            </div>`;
};

const addIcon = (type) => {
    let link;
    if (type == "Snapchat") {
        link = "https://i.pinimg.com/originals/65/a4/24/65a4240ae9174aa1e5f3af541faba57b.jpg";
    }
    else if (type == "Instagram") {
        link =  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png";
    }
    else if (type == "LinkedIn") {
        link = "https://image.flaticon.com/icons/png/512/174/174857.png";
    }
    else if (type=="Email"){
        link = "https://i.pinimg.com/originals/8f/c3/7b/8fc37b74b608a622588fbaa361485f32.png";
    }
    else if (type =="Phone #"){
        link = "https://i.pinimg.com/originals/84/4e/8c/844e8cd4ab26c82286238471f0e5a901.png";
    }
    else if (type =="Address"){
        link = "https://image.flaticon.com/icons/png/512/25/25694.png";
    }
    else {
        return "";
    }
    return link;
}

const changeName = (contactName) => {
    const userRef = firebase.database().ref('users');
    let contactFullName = ""; 
    userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        for (let key in data){
            if(data[key].username == contactName) {  
                contactFullName = data[key].fullName;
            };
        }
        const name = document.querySelector("#contactName");
        name.innerHTML = `${contactFullName}'s Contact Information`;
    });
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
    else if(type=='Phone #'){
        return `<a href="tel:${contact}">${contact}</a>`;
    }
    else if(type=='Email'){
        return `<a href="mailto:${contact}">${contact}</a>`
    }
    else {
        return contact;
    }
    if (link) {
        return `<a href=${link}${contact}>${contact}</a>`;
    }
};