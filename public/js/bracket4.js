const leftColumn = document.getElementById("leftColumn");

function createBox(content) {
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = content;
    leftColumn.appendChild(box);
}

// For demonstration, create 5 boxes with numbers
for (let i = 1; i <= 5; i++) {
    createBox(i);
}
