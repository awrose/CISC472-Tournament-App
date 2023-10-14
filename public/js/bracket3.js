function createBracket(participants) {
    const container = document.getElementById('bracket-container');

    let currentParticipants = participants;
    let gameHeight = 80; 

    while (currentParticipants.length > 1) {
        const winners = [];
        const roundDiv = document.createElement('div');
        roundDiv.classList.add('round');

        for (let j = 0; j < currentParticipants.length; j += 2) {
            const bracketGame = document.createElement('div');
            bracketGame.classList.add('bracket-game');
            bracketGame.style.height = `${gameHeight}px`;  // Set dynamic height

            const player1 = currentParticipants[j];
            const player2 = currentParticipants[j + 1] ? currentParticipants[j + 1] : {name: "", score: ""};

            bracketGame.appendChild(createPlayerDiv(player1.name, player1.score));
            bracketGame.appendChild(createPlayerDiv(player2.name, player2.score));

            roundDiv.appendChild(bracketGame);

            // Logic for winner determination
/*             if (parseInt(player1.score) > parseInt(player2.score)) {
                winners.push(player1);
            } else {
                winners.push(player2);
            } */
        }

        container.appendChild(roundDiv);
        currentParticipants = winners;

        gameHeight *= 2;  // Double the height for the next round
    }

    // Handle final winner separately as above
}

function createPlayerDiv(name, score) {
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player');
    
    const nameAnchor = document.createElement('a');
    nameAnchor.href = "javascript:void(0)";
    nameAnchor.classList.add('name');
    nameAnchor.textContent = name;

    // Click event for the player's name
    nameAnchor.addEventListener('click', function(event) {
        const gameDiv = event.target.closest('.bracket-game');
        const nextGame = gameDiv.nextSibling;

        // If there's a next game and it doesn't have players yet
        if (nextGame && !nextGame.firstChild) {
            const winnerDiv = createPlayerDiv(name, score);
            winnerDiv.classList.add('win');  // Mark the player as a winner

            nextGame.appendChild(winnerDiv);
        }
    });

    const scoreDiv = document.createElement('div');
    scoreDiv.classList.add('score');
    scoreDiv.textContent = score;
    
    playerDiv.appendChild(nameAnchor);
    playerDiv.appendChild(scoreDiv);
    
    return playerDiv;
}


// Sample data and execution
const participantsData = [
    {name: "Snute", score: "3"},
    {name: "TLO", score: "1"},
    {name: "ToD", score: "0"},
    {name: "MC", score: "3"},
    {name: "Test", score: "3"},
    {name: "TEST1", score: "1"},
    {name: "Test2", score: "0"},
    {name: "Test3", score: "3"},
    {name: "Snute", score: "3"},
    {name: "TLO", score: "1"},
    {name: "ToD", score: "0"},
    {name: "MC", score: "3"},
    {name: "Test", score: "3"},
    {name: "TEST1", score: "1"},
    {name: "Test2", score: "0"},
    {name: "Test3", score: "3"},
    // Add more participants as needed
];

// Ensure DOM is loaded before executing
document.addEventListener("DOMContentLoaded", function() {
    createBracket(participantsData);
});
