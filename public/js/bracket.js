function createBracket(playerCount) {
    // Find nearest power of 2
    let nearestPowerOfTwo = Math.pow(2, Math.ceil(Math.log(playerCount) / Math.log(2)));

    let container = document.querySelector('.Container');
    container.innerHTML = ""; // Clear any existing content

    createRound(container, nearestPowerOfTwo, playerCount);
}

function createRound(container, size, maxPlayers) {
    let branch = document.createElement('div');
    branch.className = `Branch_${Math.log2(size) + 1}`;
    container.appendChild(branch);

    for (let i = 0; i < size / 2; i++) {
        let object = document.createElement('div');
        object.className = `Object_${Math.log2(size) + 1}`;
        branch.appendChild(object);

        for (let j = 0; j < 2; j++) {
            let playerId = (i * 2) + j + 1;

            let player = document.createElement('div');
            let select = document.createElement('select');
            select.className = 'Name';
            select.id = `Player${playerId}`;
            let playerName = playerId <= maxPlayers ? `Player ${playerId}` : 'N/A';
            let option = document.createElement('option');
            option.value = playerName;
            option.textContent = playerName;
            select.appendChild(option);
            player.appendChild(select);
            object.appendChild(player);

            let result = document.createElement('div');
            let form = document.createElement('form');
            form.name = `FormId${playerId}`;
            form.className = 'Result';
            let resultSelect = document.createElement('select');
            resultSelect.id = `Result${playerId}`;
            for (let k = 0; k <= 3; k++) {
                let resultOption = document.createElement('option');
                resultOption.value = k;
                resultOption.textContent = k;
                resultSelect.appendChild(resultOption);
            }
            form.appendChild(resultSelect);
            result.appendChild(form);
            object.appendChild(result);
        }
    }

    if (size > 2) {
        createRound(container, size / 2, maxPlayers);
    }
}

// To use the function, provide the number of players
createBracket(10); // For 10 players
