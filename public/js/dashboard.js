// Extracting tournamentId from URL
const db = firebase.firestore();

let userUid;
let userEmail;
let userDisplayName;

firebase.auth().onAuthStateChanged(function(user){
    if(user){
        console.log('user is signed in');
        userUid = user.uid;
        userEmail = user.email;
        userDisplayName = user.displayName || 'Nameless User';
    }else{
        console.log('The user is not signed in');
    }
});

function getTournamentIdFromURL(){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

const tournamentId = getTournamentIdFromURL();
console.log(tournamentId);

function openTab(tabId, elmnt) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    var tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active-tab", "");
    }

    document.getElementById(tabId).style.display = "block";
    elmnt.className += " active-tab";
}

document.getElementsByClassName("tablink")[0].click();


if (tournamentId) {
    db.collection("tournaments").doc(tournamentId).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();

            // Populate form fields using data object
            document.getElementById("tourneyNameInput").value = data.name || '';
            document.getElementById("tourneyDescriptInput").value = data.description || '';
            document.getElementById('tourneyRulesInput').value = data.rules || '';
            document.getElementById('startDateTimeInput').value = data.startDate || '';
            document.getElementById('emailInput').value = data.primaryEmail || '';
            document.getElementById('gameNameSelect').value = data.game || '';
            document.getElementById('manualInputGame').value = data.game || '';
            document.getElementById('tourneyTypeSelect').value = data.tourneyType || '';
            document.getElementById('onlineCheckbox').checked = data.online || false;
            document.getElementById('streamingCheckbox').checked = data.streaming || false;
            document.getElementById('streamingServiceInput').value = data.streamingService || '';
            document.getElementById('streamingUserInput').value = data.streamingUser || '';
            document.getElementById('streamingServiceLink').value = data.streamingLink || '';
            document.getElementById('entryFeeCheckbox').checked = data.entryFee || false;
            document.getElementById('entryFeeAmtInput').value = data.entryFeeAmt || '';
            document.getElementById('prizesCheckbox').checked = data.prizes || false;
            document.getElementById('prizeDescriptionInput').value = data.prizesDescript || '';
            document.getElementById('publicTourneyCheckbox').checked = data.public || false;
            document.getElementById('autoGenerateBracketsCheckbox').checked = data.autoGenerateBrackets || false;

        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function getValue(id, defaultValue){
    let element = document.getElementById(id);
    if(element){
        return element.value || defaultValue;
    }
    return defaultValue;
}

function getCheckboxValue(id){
    let checkbox = document.getElementById(id);
    return checkbox ? checkbox.checked : false;
}

document.getElementById("tournamentForm").addEventListener('submit', function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const updatedData = {
        name: getValue('tourneyNameInput', 'This Tournament has no Description'),
        description: getValue('tourneyDescriptInput', 'This Tournament has no Description'),
        rules: getValue('tourneyRulesInput', 'This Tournament has No Rules'),
        startDate: getValue('startDateTimeInput', 'This tournament doesn\'t have a set start date yet'),
        endDate: getValue('endDateTimeInput', 'This tournament doesn\'t have an end date set'),
        primaryEmail: getValue('emailInput', 'no email provided'),
        game: getValue('gameNameSelect', getValue('manualInputGame','There is no game selected yet')),
        type: getValue('tourneyTypeSelect', 'This tournament doesn\'t have a selected type'),
        online: getCheckboxValue('onlineCheckbox'),
        streaming: getCheckboxValue('streamingCheckbox'),
        streamingService: getValue('streamingServiceInput', 'There is no streaming service input selected'),
        streamingUser: getValue('streamingUserInput', 'There hasn\'t been a username given'),
        streamingLink: getValue('streamingServiceLink', 'The link hasn\'t been provided yet'),
        entryFee: getCheckboxValue('entryFeeCheckbox'),
        entryFeeAmt: getValue('entryFeeAmtInput', 0),
        prizes: getCheckboxValue('prizesCheckbox'),
        prizesDescript: getValue('prizeDescriptionInput', 'There are no prizes for this tournament'),
        public: getCheckboxValue('publicTourneyCheckbox'),
        autoGenerateBrackets: getCheckboxValue('autoGenerateBracketsCheckbox'),
    };

    db.collection("tournaments").doc(tournamentId).update(updatedData).then(() => {
        alert("Tournament updated successfully!");
    }).catch((error) => {
        console.log("Error updating document: ", error);
    });
});



// A function to display the registrants
function displayRegistrants() {
    var registrantsContainer = document.getElementById('registrantsContainer');
    var registrants = [];

    db.collection("tournaments").doc(tournamentId).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            registrants = data.registrants;
            registrantsContainer.innerHTML = '';

            // Loop through each registrant and create HTML
            registrants.forEach(function(registrant) {
                //console.log(registrant.uid);
                var registrantBox = document.createElement('div');
                registrantBox.className = 'registrant-box';
        
                var registrantInfo = document.createElement('div');
                registrantInfo.className = 'registrant-info';
                registrantInfo.innerHTML = `<strong>${registrant.name}</strong><span>${registrant.email}</span>`;
        
                var deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.innerText = 'Delete';
                deleteButton.setAttribute('data-id', registrant.uid);
                deleteButton.onclick = function() {
                    deleteRegistrant(this.getAttribute('data-id'));
                };
        
                registrantBox.appendChild(registrantInfo);
                registrantBox.appendChild(deleteButton);
                registrantsContainer.appendChild(registrantBox);
            });
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
3

// Call the display function when the page loads
//window.onload = console.log('window on load');
window.onload = displayRegistrants;

function addNewRegistrant(){
    const name = prompt('Enter registrant\'s name: ');
    const email = prompt('Enter registrant\'s emai:');

    if(name && email){
        const id = "ID_" + Date.now();
        const currentDoc = firebase.firestore().collection("tournaments").doc(tournamentId);
        currentDoc.update({
            registrants: firebase.firestore.FieldValue.arrayUnion({
                uid: id,
                name: name,
                email: email
            })
        }).then(() => {
                alert("Success! You have been registered for the tournament!");
                displayRegistrants();
        }).catch((err) => {
                console.error("Error updating document: ", err);
                alert("There was an error registering for the tournament please reach out to...");
        })

    }else{
        alert("Please provide both name and email to add a registrant");
    }
}

document.getElementById("addRegistrantButton").addEventListener("click", addNewRegistrant);


function deleteRegistrant(registrantUid){
    console.log(registrantUid)
    const currentDoc = firebase.firestore().collection("tournaments").doc(tournamentId);
    
    currentDoc.get().then((docSnapshot) => {
        if(docSnapshot.exists) {
            const data = docSnapshot.data();
            const registrantToRemove = (data.registrants || []).find(registrant => registrant.uid === registrantUid);
            
            if (registrantToRemove) {
                return currentDoc.update({ 
                    registrants: firebase.firestore.FieldValue.arrayRemove(registrantToRemove) 
                });
            } else {
                console.error("The provided UID was not found in the registrants array.");
            }
        }
    }).then(() => {
        alert("Success! You have deleted the registrant with the UID: " + registrantUid + " from the tournament");
        displayRegistrants();
    }).catch((err) => {
        console.error("Error updating document: ", err);
        alert("There was an error removing this registrant from the tournament");
    });
}

