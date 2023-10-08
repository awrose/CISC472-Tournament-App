const db = firebase.firestore();

function getTournamentIdFromURL(){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

const tournamentId = getTournamentIdFromURL();

if(tournamentId){
    db.collection("tournaments").doc(tournamentId).get().then(function(doc){
        if(doc.exists){
            var tournamentData = doc.data();
            console.log(tournamentData);
            
        }else{
            console.log("There is no tournament!");
        }
    }).catch(function(error){
        console.log("ERror getting tournament data:", error);
    });
}