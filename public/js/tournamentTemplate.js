const db = firebase.firestore();
const user = firebase.auth().currentUser;

let userUid;
let userEmail;
let userDisplayName;

firebase.auth().onAuthStateChanged(function(user){
    if(user){
        console.log('user is signed in');
        userUid = user.uid;
        userEmail = user.email;
        userDisplayName = user.displayName;
    }else{
        sessionStorage.setItem('redirectTo', window.location.href);
        window.location.href = "../pages/logInSignUp.html"
        console.log('The user is not signed in');
    }
});

function getTournamentIdFromURL(){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

const tournamentId = getTournamentIdFromURL();
console.log(tournamentId);

if(tournamentId){
    db.collection("tournaments").doc(tournamentId).get().then(function(doc){
        if(doc.exists){
            var tournamentData = doc.data();
            console.log(tournamentData);

            //=============================countdown==========================
            if(tournamentData.startDate){
                const startDate = new Date(tournamentData.startDate);
                function updateCountdown(){
                    const now = new Date();
                    const timeDiff = startDate - now;
    
                    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
                    document.getElementById("days").textContent = days;
                    document.getElementById("hours").textContent = hours;
                    document.getElementById("minutes").textContent = minutes;
                    document.getElementById("seconds").textContent = seconds;
                }
    
                updateCountdown();
                setInterval(updateCountdown, 1000);
            }
            
            //==========================header==========================================
            document.getElementById('tourneyNameInput').textContent = tournamentData.name;
            document.getElementById('organizerNameInput').textContent = tournamentData.createdBy.name;
            document.getElementById('tourneyDescriptInput').textContent = tournamentData.description;
            
            if(tournamentData.online){
                document.getElementById('location').textContent = "This tournament will be held online"
            }else{
                document.getElementById('location').textContent = "This tournament will be held in person/the location hasn\'t been set";
            }

            //=====================DETAILS===================================
            document.getElementById("gameInput").textContent = tournamentData.game;
            document.getElementById("tourneyTypeSelect").textContent = tournamentData.type;
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            document.getElementById("startDateTimeInput").textContent = new Date(tournamentData.startDate).toLocaleDateString(undefined, options);
            
            
            if(tournamentData.entryFee){
                document.getElementById("entryFeeAmtInput").textContent = tournamentData.entryFeeAmt;
            }else{
                console.log('this tourney doesn\'t have an entry fee');
                document.getElementById("entryFee").style.display = 'none';
            }

/*             if(tournamentData.online){
                console.log('this tournament will be online');
                document.getElementById("platformInput").textContent = tournamentData.onlinePlatform;
            }else{
                console.log('this tournament will be in person/location hasnt been set yet');
                document.getElementById('platform').style.display = 'none';
            } */
            

            //============================registration==========================
/*             if(tournamentData.openForRegistration){
                console.log('this tournament is open for registration');
/*                 if(tournamentData.solo){
                    console.log('this tournament is a SOLO competition')
                    document.getElementById("openForRegistrationInput").textContent = "This tournament is open for SOLO registration there are X spots left";
                    document.getElementById("registrationLockDateInput").textContent = new Date(tournamentData.registrationLockDate);
                    //document.getElementById("teamHeadCount").style.display = 'none';
                }else if(tournamentData.teams){
                    console.log('this tournament is a TEAM BASED comp')
                    document.getElementById("openForRegistrationInput").textContent = "This tournament is open for TEAM registration there are X spots left";
                    document.getElementById("registrationLockDateInput").textContent = new Date(tournamentData.registrationLockDate);
                    //document.getElementById("soloHeadCount").style.display = 'none';
                }  
            }else{
                console.log('this tournament is NOT open for registration');
                document.getElementById("openForRegistrationInput").textContent = "Tournament Registration is closed";
                document.getElementById("registrationLockDate").style.display = 'none';
            } */

            console.log('tourney rules' + tournamentData.rules);
            document.getElementById("tourneyRulesInput").textContent = tournamentData.rules;

/*             if(tournamentData.solo){
                console.log('this tournament is SOLO');
                document.getElementById("soloHeadCountInput").textContent = tournamentData.openSlots;
                document.getElementById("teamHeadCount").style.display = 'none';
            }else if(tournamentData.team){
                console.log('this tournament is TEAM BASED');
                document.getElementById("teamHeadCountInput").textContent = tournamentData.openSlots;
                document.getElementById("soloHeadCount").style.display = 'none';
            } */

            //figure out registrants

            if(tournamentData.prizes){
                console.log('this tournament has PRIZES');
                document.getElementById("prizeDescriptionInput").textContent = tournamentData.prizesDescript;
            }else{
                console.log('this tourney does NOT have prizes');
                document.getElementById("prizes").style.display = 'none';
            } 

            if(tournamentData.streaming){
                document.getElementById("streamingServiceInput").textContent = tournamentData.streamingService;
                document.getElementById("streamingUserInput").textContent = tournamentData.streamingUser;
                document.getElementById("streamingLink").textContent = tournamentData.streamingLink;
            }else{
                document.getElementById("streaming").style.display = 'none';
            }

            const register = document.getElementById("registerButton");
            //const soloModal = document.getElementById("soloRegistrationModal");
            //const closeSoloModal = document.getElementById("closeSoloModal");
            //const registerSolo = document.getElementById("submitSoloRegistrant");

            register.addEventListener("click", function(event){
                console.log('button was clicked');
                //event.preventDefault();
                //if(tournamentData.solo){
                    const currentDoc = firebase.firestore().collection("tournaments").doc(tournamentId);
                    currentDoc.update({
                        registrants: firebase.firestore.FieldValue.arrayUnion({
                            uid: userUid,
                            name: userDisplayName,
                            email: userEmail
                        })
                    }).then(async () => {
                        const userTournamentsRef = db.collection("users").doc(userUid).collection('registeredTournaments')
                        await userTournamentsRef.add({
                            tournamentId: tournamentId
                        })
                            alert("Success! You have been registered for the tournament!");
                    }).catch((err) => {
                            console.error("Error updating document: ", err);
                            alert("There was an error registering for the tournament please reach out to...");
                    })
                    //soloModal.style.display = 'none'
                });

                    //registerSolo.addEventListener("click", function(){
/*                         const currentDoc = firebase.firestore().collection("tournaments").doc(tournamentId);
                        const soloRegistrantsName = document.getElementById('soloRegistrantName').value; */
                        //const soloRegistrantsEmail = document.getElementById('soloRegistrantEmail').value;

/*                         currentDoc.update({
                            registrants: firebase.firestore.FieldValue.arrayUnion({
                                uid: userUid,
                                name: userDisplayName,
                                email: userEmail
                            }).then(() => {
                                alert("Success! You have been registered for the tournament!");
                            }).catch((err) => {
                                console.error("Error updating document: ", error);
                                alert("There was an error registering for the tournament please reach out to...");
                            })
                        })
                        //soloModal.style.display = 'none'
                    }); */

/*                     window.addEventListener("click", function(event){
                        if(event.target == soloModal){
                            soloModal.style.display = 'none';
                        }
                    }); */
                //}

            //})
            document.getElementById("editButton").addEventListener('click', function(event) {
                event.preventDefault();

                window.location.href = "/pages/dashboard.html?id=" + tournamentId;
            });
            
        }else{
            console.log("There is no tournament!");
        }
    }).catch(function(error){
        console.log("Error getting tournament data:", error);
    });
}

