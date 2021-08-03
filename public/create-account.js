let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const createCard = () => {
    return `<div class="card mb-5">  
                    <div class="card-content"> 
                        <div class="content columns">
                            <div class="select column is-narrow">
                                <select class="dropdowns">
                                    <option>Snapchat</option>
                                    <option>Instagram</option>
                                    <option>LinkedIn</option>
                                    <option>Phone #</option>
                                    <option>email</option>
                                    <option>address</option>
                                </select>
                            </div>
                            <div class="column">
                                <input class="input contacts" type="text">
                            </div>
                        </div>
                    </div> 
                </div>`;
};

const addCard = () => {
    let card = createCard();
    document.querySelector("#cards").innerHTML += card;
};

const addInfo = () => {
    const dbRef = firebase.database().ref(`users/${googleUser.uid}`);
    let dropdowns = document.querySelectorAll(".dropdowns");
    let contacts = document.querySelectorAll(".contacts");
    let info = [];
    for (let i = 0; i < dropdowns.length; i++){
        info.push({
            type: dropdowns[i].value, 
            contact: contacts[i].value
        });
    };
    console.log(info);
    dbRef.set({
        username: document.querySelector("#username-input").value,
        contacts: info,
        imageUrl: "https://www.personality-insights.com/wp-content/uploads/2017/12/default-profile-pic-e1513291410505.jpg"
    }).then( () => {
        window.location = 'contacts.html'; 
    });
    
};

