const db = firebase.firestore();

/*window.onload = function(){
    const path = window.location.pathname;
    const segments = path.split('/');

    if(segments[1] === 'tournament' && segments[2]){
        const tournamentId = segments[2];
        db.collection("tournaments").doc(tournamentId).get().then((doc) => {
            if(doc.exists){
                console.log("Tournament Data:", doc.data());
            }else{
                //handle error
                console.log('Cant be found')
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
    }
}*/

let soloPlayers = document.getElementById('soloCheckbox');
let teamPlayers = document.getElementById('teamsCheckbox');
let openForRegistration = document.getElementById('openForRegistrationCheckbox');
let onlineRegistration = document.getElementById('onlineCheckbox');
let streaming = document.getElementById('streamingCheckbox');
let entryFee = document.getElementById('entryFeeCheckbox');
let prizes = document.getElementById('prizesCheckbox');

soloPlayers.addEventListener("change", function(){
    let hiddenInput = document.getElementById('hiddenInputForSolo');
    showHiddenInput(soloPlayers, hiddenInput, teamPlayers);
});

openForRegistration.addEventListener("change", function(){
    let hiddenInput = document.getElementById('hiddenInputForRegistration');
    showHiddenInput(openForRegistration, hiddenInput, null)
});

teamPlayers.addEventListener("change", function(){
    let hiddenInput = document.getElementById("hiddenInputForTeamRegistration");
    showHiddenInput(teamPlayers, hiddenInput, soloPlayers);
});

onlineRegistration.addEventListener("change", function(){
    let hiddenInput = document.getElementById("hiddenInputForOnlineCheckbox");
    showHiddenInput(onlineRegistration, hiddenInput, null);
});

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

/*let submitBtn = document.getElementById('submitButton');
submitBtn.addEventListener("click", async function(){
    console.log("SUBMITTED");

    let manualInputGame = document.getElementById('manualInputGame').value;
    if(!manualInputGame.trim()){
    }else{
        let newGame = {
            name: manualInputGame
        };
        storeGames(newGame);
    }

    const newTournament = {
        name: getValue('tourneyNameInput', 'This Tournament has no Description'),
        description: getValue('tourneyDescriptInput', 'This Tournament has no Description'),
        rules: getValue('tourneyRulesInput', 'This Tournament has No Rules'),
        startDate: getValue('startDateTimeInput', 'This tournament doesn\'t have a set start date yet'),
        endDate: getValue('endDateTimeInput', 'This tournament doesn\'t have an end date set'),
        primaryEmail: getValue('emailInput'),
        game: getValue('gameInput', getValue('manualInputGame','There is no game selected yet')),
        type: getValue('tourneyTypeSelect', 'This tournament doesn\'t have a selected type'),
        solo: getCheckboxValue('soloCheckbox'),
        soloHeadCount: getValue('soloHeadCountInput', 0),
        team: getCheckboxValue('teamsCheckbox'),
        teamNumber: getValue('numberOfTeamsInput', 0),
        playersPerTeam: getValue('playersPerTeamInput', 0),
        openForRegistration: getCheckboxValue('openForRegistrationCheckbox'),
        registrationLockDate: getValue('registrationLockDate', 'There is no deadline for registration'),
        online: getCheckboxValue('onlineCheckbox'),
        onlinePlatform: getValue('onlinePlatformSelect', 'There hasn\'t been an online platform selected'),
        streaming: getCheckboxValue('streamingCheckbox'),
        streamingService: getValue('streamingServiceInput', 'There is no streaming service input selected'),
        streamingUser: getValue('streamingUserInput', 'There hasn\'t been a username given'),
        entryFee: getCheckboxValue('entryFeeCheckbox'),
        entryFeeAmt: getValue('entryFeeAmtInput', 0),
        prizes: getCheckboxValue('prizesCheckbox'),
        prizesDescript: getValue('prizeDescriptionInput', 'There are no prizes for this tournament'),
        public: getCheckboxValue('publicTourneyCheckbox'),
        autoGenerateBrackets: getCheckboxValue('autoGenerateBracketsCheckbox')
    };
    
    addDoc(tournamentCollection, newTournament);

    let allGames = getGames();
    console.log(allGames);
})*/

let form = document.getElementById('tournamentForm');
form.addEventListener('submit', function(event){
    event.preventDefault();
    
    db.collection("tournaments").add({
        name: getValue('tourneyNameInput', 'This Tournament has no Description'),
        description: getValue('tourneyDescriptInput', 'This Tournament has no Description'),
        rules: getValue('tourneyRulesInput', 'This Tournament has No Rules'),
        startDate: getValue('startDateTimeInput', 'This tournament doesn\'t have a set start date yet'),
        endDate: getValue('endDateTimeInput', 'This tournament doesn\'t have an end date set'),
        primaryEmail: getValue('emailInput'),
        game: getValue('gameInput', getValue('manualInputGame','There is no game selected yet')),
        type: getValue('tourneyTypeSelect', 'This tournament doesn\'t have a selected type'),
        solo: getCheckboxValue('soloCheckbox'),
        soloHeadCount: getValue('soloHeadCountInput', 0),
        team: getCheckboxValue('teamsCheckbox'),
        teamNumber: getValue('numberOfTeamsInput', 0),
        playersPerTeam: getValue('playersPerTeamInput', 0),
        openForRegistration: getCheckboxValue('openForRegistrationCheckbox'),
        registrationLockDate: getValue('registrationLockDate', 'There is no deadline for registration'),
        online: getCheckboxValue('onlineCheckbox'),
        onlinePlatform: getValue('onlinePlatformSelect', 'There hasn\'t been an online platform selected'),
        streaming: getCheckboxValue('streamingCheckbox'),
        streamingService: getValue('streamingServiceInput', 'There is no streaming service input selected'),
        streamingUser: getValue('streamingUserInput', 'There hasn\'t been a username given'),
        entryFee: getCheckboxValue('entryFeeCheckbox'),
        entryFeeAmt: getValue('entryFeeAmtInput', 0),
        prizes: getCheckboxValue('prizesCheckbox'),
        prizesDescript: getValue('prizeDescriptionInput', 'There are no prizes for this tournament'),
        public: getCheckboxValue('publicTourneyCheckbox'),
        autoGenerateBrackets: getCheckboxValue('autoGenerateBracketsCheckbox')
    }).then((docRef) => {
        /*console.log("Document written with ID:", docRef.id);
        const baseUrl = window.location.origin; // gets the base URL (e.g., https://yourwebsite.com)
        console.log("baseURL: ", baseUrl);
        const uniqueTournamentURL = `${baseUrl}/tournament.html?id=/${docRef.id}`;
        console.log("unique URL: ", uniqueTournamentURL);*/
    
        // Redirect the user to the new page
        window.location.href = "/pages/tournament.html?id=" + docRef.id;;
    }).catch((error) => {
        console.log("Error adding document: ", error);
    });
})


function storeGames(game){
    let games = JSON.parse(localStorage.getItem('games')) || [];
    games.push(game);
    localStorage.setItem('games', JSON.stringify(games));
}

function getGames(){
    const retrievedData = JSON.parse(localStorage.getItem('games'));
    const sortedData = retrievedData.sort((a, b) => a.name.localCompare(b.name));
    return sortedData;
}

