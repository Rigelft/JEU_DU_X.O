let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameWon = false;
let scores = { "X": 0, "O": 0 };
let playerNames = { "X": "Joueur 1", "O": "Joueur 2" };
let avatars = { "X": "", "O": "" };
let totalGames = 0;
let gamesPlayed = 0;
let playWithAI = false;

function selectAvatar(player, avatarSrc, element) {
    avatars[player] = avatarSrc;
    const avatarSelection = element.parentElement;
    const avatarImages = avatarSelection.getElementsByTagName('img');
    for (let i = 0; i < avatarImages.length; i++) {
        avatarImages[i].classList.remove('selected');
    }
    element.classList.add('selected');
}

function toggleAIOptions() {
    playWithAI = document.getElementById("playWithAI").checked;
    const player2Info = document.getElementById("player2Info");
    const aiDifficulty = document.getElementById("aiDifficulty");
    if (playWithAI) {
        player2Info.classList.add("hidden");
        aiDifficulty.classList.remove("hidden");
    } else {
        player2Info.classList.remove("hidden");
        aiDifficulty.classList.add("hidden");
    }
}

function startGame() {
    const player1Name = document.getElementById("player1").value;
    const player2Name = document.getElementById("player2").value;
    const selectedGames = document.querySelector('input[name="numGames"]:checked');
    playWithAI = document.getElementById("playWithAI").checked;

    if (!player1Name || (!player2Name && !playWithAI) || !avatars["X"] || (!avatars["O"] && !playWithAI) || !selectedGames) {
        showPopup("Veuillez définir un nom, un avatar pour les deux joueurs et sélectionner le nombre de parties.");
        return;
    }

    playerNames["X"] = player1Name;
    playerNames["O"] = playWithAI ? "IA" : player2Name;
    totalGames = parseInt(selectedGames.value);

    document.getElementById("name1Display").textContent = playerNames["X"];
    document.getElementById("name2Display").textContent = playerNames["O"];
    document.getElementById("avatar1Display").src = avatars["X"];
    if (playWithAI) {
        const aiAvatars = ["avatars/ava-1.jpeg", "avatars/ava-2.jpeg", "avatars/ava-3.jpeg", "avatars/ava-4.jpeg", "avatars/ava-5.jpeg", "avatars/ava-6.jpeg", "avatars/ava-7.jpeg", "avatars/ava-8.jpeg"];
        avatars["O"] = aiAvatars[Math.floor(Math.random() * aiAvatars.length)];
        document.getElementById("avatar2Display").src = avatars["O"];
    } else {
        document.getElementById("avatar2Display").src = avatars["O"];
    }
    document.getElementById("totalGames").textContent = totalGames;

    document.getElementById("gameSection").classList.remove("hidden");
    document.getElementById("gameInfo").classList.remove("hidden");
    document.getElementById("player1Info").classList.add("hidden");
    document.getElementById("player2Info").classList.add("hidden");
    document.getElementById("numGamesInfo").classList.add("hidden");
    document.getElementById("startButton").classList.add("hidden");
    document.getElementById("newGameButton").classList.remove("hidden");
    resetGame();
}

const board = document.getElementById("board");
board.addEventListener("click", (e) => {
    if (gameWon || (currentPlayer === "O" && playWithAI)) return;
    if (e.target.tagName === "TD") {
        let cellId = e.target.id;
        let cellIndex = parseInt(cellId.split("-")[1]) - 1;
        if (gameBoard[cellIndex] === "") {
            gameBoard[cellIndex] = currentPlayer;
            e.target.textContent = currentPlayer;
            e.target.classList.add(currentPlayer === "X" ? "player-x" : "player-o");
            checkGame();
            if (!gameWon) {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                updateCurrentPlayerDisplay();
                if (playWithAI && currentPlayer === "O") {
                    setTimeout(aiMove, Math.random() * 2000 + 1000);
                }
            }
        }
    }
});

function aiMove() {
    let emptyCells = gameBoard.map((val, index) => val === "" ? index : null).filter(val => val !== null);
    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameBoard[randomCell] = "O";
    document.getElementById(`cell-${randomCell + 1}`).textContent = "O";
    document.getElementById(`cell-${randomCell + 1}`).classList.add("player-o");
    checkGame();
    if (!gameWon) {
        currentPlayer = "X";
        updateCurrentPlayerDisplay();
    }
}

function checkGame() {
    let winner = null;
    let winCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < winCombinations.length; i++) {
        let combination = winCombinations[i];
        if (
            gameBoard[combination[0]] === currentPlayer &&
            gameBoard[combination[1]] === currentPlayer &&
            gameBoard[combination[2]] === currentPlayer
        ) {
            winner = currentPlayer;
            break;
        }
    }
    if (winner) {
        showPopup(`${playerNames[winner]} gagne!`);
        scores[winner]++;
        updateScores();
        gameWon = true;
        gamesPlayed++;
        updateGameInfo();
        if (gamesPlayed < totalGames) {
            showCountdown();
        } else {
            declareUltimateWinner();
        }
    } else if (gameBoard.indexOf("") === -1) {
        showPopup("Match nul!");
        gameWon = true;
        gamesPlayed++;
        updateGameInfo();
        if (gamesPlayed < totalGames) {
            showCountdown();
        } else {
            declareUltimateWinner();
        }
    }
}

function showPopup(message) {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    document.getElementById("popupMessage").textContent = message;
    popup.style.display = "block";
    overlay.style.display = "block";
}

function closePopup() {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    popup.style.display = "none";
    overlay.style.display = "none";
}

function showCountdown() {
    let countdown = 6;
    const countdownElement = document.createElement("div");
    countdownElement.style.position = "absolute";
    countdownElement.style.top = "10px";
    countdownElement.style.left = "50%";
    countdownElement.style.transform = "translateX(-50%)";
    countdownElement.style.fontSize = "24px";
    countdownElement.style.color = "red";
    countdownElement.textContent = `Nouvelle partie dans ${countdown} secondes...`;
    document.body.appendChild(countdownElement);

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = `Nouvelle partie dans ${countdown} secondes...`;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            document.body.removeChild(countdownElement);
            clearBoard();
        }
    }, 1000);
}

function updateScores() {
    document.getElementById("score1Value").textContent = scores["X"];
    document.getElementById("score2Value").textContent = scores["O"];
}

function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameWon = false;
    currentPlayer = Math.random() < 0.5 ? "X" : "O";
    updateCurrentPlayerDisplay();
    clearBoard();
    if (playWithAI && currentPlayer === "O") {
        setTimeout(aiMove, Math.random() * 2000 + 1000);
    }
}

function clearBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell-${i + 1}`);
        cell.textContent = "";
        cell.classList.remove("player-x", "player-o");
    }
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameWon = false;
}

function updateGameInfo() {
    document.getElementById("currentGame").textContent = gamesPlayed;
}

function updateCurrentPlayerDisplay() {
    document.getElementById("currentPlayerName").textContent = playerNames[currentPlayer];
    document.getElementById("currentPlayerSymbol").textContent = currentPlayer;
}

function declareUltimateWinner() {
    let ultimateWinner = scores["X"] > scores["O"] ? playerNames["X"] : playerNames["O"];
    let ultimateLoser = scores["X"] > scores["O"] ? playerNames["O"] : playerNames["X"];
    showPopup(`Le gagnant ultime est ${ultimateWinner} avec ${Math.max(scores["X"], scores["O"])} points!`);
}

