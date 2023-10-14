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

let onlineRegistration = document.getElementById('onlineCheckbox');
let streaming = document.getElementById('streamingCheckbox');
let entryFee = document.getElementById('entryFeeCheckbox');
let prizes = document.getElementById('prizesCheckbox');

streaming.addEventListener("change", function(){
    let hiddenInput = document.getElementById("hiddenInputForStreaming");
    showHiddenInput(streaming, hiddenInput, null);
});

entryFee.addEventListener("change", function(){
    let hiddenInput = document.getElementById('hiddenInputForEntryFee');
    showHiddenInput(entryFee, hiddenInput, null);
});

prizes.addEventListener("change", function(){
    let hiddenInput = document.getElementById('hiddenInputForPrizes');
    showHiddenInput(prizes, hiddenInput, null);
});

function showHiddenInput(checkbox, hiddenInput, disable){
    if(checkbox.checked){
        hiddenInput.classList.remove('hidden');
        hiddenInput.classList.add('conditionalInput');
        if(disable){
            disable.disabled = true;
        }
    }else{
        hiddenInput.classList.add('hidden');
        hiddenInput.classList.remove('conditionalInput');
        if(disable){
            disable.disabled = false;
        }
    }
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

let form = document.getElementById('tournamentForm');
form.addEventListener('submit', async function(event){
    event.preventDefault();
    
    await db.collection("tournaments").add({
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
        createdBy: {
            uid: userUid,
            email: userEmail,
            name: userDisplayName
        },
        registrants: [],
    })

    .then(async (docRef) => {
        const userTournamentsRef = db.collection("users").doc(userUid).collection('createdTournaments')
        await userTournamentsRef.add({
            tournamentId: docRef.id
        })
        window.location.href = "/pages/tournament.html?id=" + docRef.id;
    }).catch((error) => {
        console.log("Error adding document: ", error);
    });
});

