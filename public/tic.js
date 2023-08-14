const socket = io("https://tic-tac-toe-advanced.ranjankashyap1.repl.co");
let onlinePlayer;
let yourName;
let onlinePlayerName;
let tickSound = new Audio("/sounds/tick.wav");
let winSound = new Audio("/sounds/win.wav");
let drawSound = new Audio("/sounds/draw.mp3");
let playSound = new Audio("/sounds/turn.mp3");
let bg = new Audio("/sounds/bg.mp3");
let sentSound = new Audio("/sounds/sent.mp3");
bg.loop = true;
let model = document.querySelector("#dialog");
let model2 = document.querySelector("#dialog2");
let model3 = document.querySelector("#dialog3");
let players = document.querySelectorAll(".player");
let dataTurn = document.querySelectorAll("[data-turn]");
let more_vert = document.getElementById("more_vert");
let turn = localStorage.getItem("turn");
let bar = document.querySelector(".bar");
let boxes = document.querySelectorAll(".box");
let winner_box = document.querySelector(".winner_box");
let playerName = document.querySelector("[data-name]");
let options = document.querySelector(".options");
let data_sug = document.querySelector("[data-sug]");
let emoji = document.querySelector('.emoji')
let data_onpl = document.querySelector("[data-onpl]");
let anaAvil = document.getElementById("ana");
let data_sug_box = document.querySelector("[data-sug-box ]");
let sug = document.getElementById("sug");
const jsConfetti = new JSConfetti();
const board = [];
const winnerList = [];
let onlineMove = [];
let Suggestions = false;
let highlight = false;
let playWithBot = false;
let gameover = false;
let RushMode = false;
let isDraw = false;
let online = false;
let bgMusicFlag = false;

function showRanjan() {
  alert("Developed by ranjan kashyap\rranjankashyap404@gmail.com");
}

function initGame() {
  model.showModal();
  // model3.showModal();
  desideTurn();
  checkTurn(turn);
  changehoverTurn(turn);
  createChart();
}

function CheckHighlight(e) {
  e.checked ? (highlight = true) : (highlight = false);
}

function MakeSuggestion() {
  if (Suggestions) {
    sug.innerHTML = "check_box_outline_blank";
    data_sug_box.classList.remove("show");

    Suggestions = false;
  } else {
    sug.innerHTML = "check_box";
    data_sug_box.classList.add("show");
    Suggestions = true;
  }
}

function desideTurn() {
  if (turn || turn !== "") {
    turn = changeTurn();
    checkTurn(turn);
    changehoverTurn(turn);
    localStorage.setItem("turn", turn);
    return;
  } else {
    let turns = ["X", "O"];
    let turnNumer = Math.floor(Math.random() * turns.length);
    turn = turns[turnNumer];
    localStorage.setItem("turn", turn);
    checkTurn(turn);
    changehoverTurn(turn);
  }
}

players.forEach((player) => {
  player.addEventListener("change", (e) => {
    Reset();
    emoji.setAttribute("hidden", "true")
    if (e.target.checked) {
      removeBotClass();
      let mode = e.target.id;
      if (mode == "bot") {
        playWithBot = true;
        RushMode = false;
        online = false;
        dataTurn[0].innerText = "You";
        dataTurn[1].innerText = "Computer";
        turn = "X";
        checkTurn(turn);
        preventPlayerToTouch("false");
        isChartAvilable("false");
      } else if (mode == "friend") {
        playWithBot = false;
        RushMode = false;
        online = false;
        dataTurn[0].innerText = "X";
        dataTurn[1].innerText = "O";
        changehoverTurn(turn);
        isChartAvilable("true");
      } else if (mode == "rush") {
        playWithBot = true;
        RushMode = true;
        online = false;
        isChartAvilable("false");

        CreateBoardData();
      } else if (mode == "online") {
        playWithBot = false;
        RushMode = false;
        online = true;
        emoji.removeAttribute("hidden")
        dataTurn[0].innerText = "You";
      }
    }
  });
});
function stopMusic() {
  bg.pause();
}
let initialTurn;
socket.on("user-joined", (names) => {
  onlinePlayer = names;
  data_onpl.textContent = onlinePlayer.name;
  dataTurn[1].innerText = onlinePlayer.name;
  dataTurn[0].innerText = "You";
  onlinePlayerName = onlinePlayer.name;

  setTimeout(() => {
    model3.close();
    turn = onlinePlayer.playerTurn;
    initialTurn = turn;
    checkTurn("X");
    changehoverTurn(turn);
    if (turn === "O") {
      addBotClass();
    }
  }, 1000);
});

socket.on("receive", (data) => {
  console.log(data);
  let move = data.message[0];
  let onlineTurn = data.message[1];
  boxes[move].innerHTML = onlineTurn;
  checkTurn("X");
  removeBotClass();
  tickSound.play();
  checkWin();
});

socket.on("left", (data) => {

  removeBotClass()
  online = false
  let nn = onlinePlayerName ||"Player"
  alert(nn + " Left")
  initGame()

})

socket.on("get", (data) => {
  sentSound.play();
  console.log(data)
  jsConfetti1.addConfetti({
    emojis: [`${data.message}`],
  });
  jsConfetti1.addConfetti();
})


const jsConfetti1 = new JSConfetti();

function sendEmoji(e) {
  sentSound.play();

  socket.emit("post", e.innerText)
  jsConfetti1.addConfetti({
    confettiNumber: 20,
    emojis: [`${e.innerText}`],
  });
  jsConfetti1.addConfetti();
  sentSound.currentTime = 0
}



setInterval(CheckOnline, 1000);
function CheckOnline() {
  if (onlinePlayer) {
    setTimeout(() => {
      model3.close();
    }, 1000);
  }
}

function isChartAvilable(e) {
  if (e === "true") {
    anaAvil.classList.add("avil");
  } else {
    anaAvil.classList.remove("avil");
  }
}

function fullscreen() {
  document.body.requestFullscreen();
}

function openAnalytics() {
  model2.showModal();
}
function showOptions() {
  options.classList.toggle("show");
}
function showModals() {
  model.showModal();
}
function closeModals() {
  model.close();
}
function startPlay() {
  model.close();
  bg.volume = 0.3;
  if (!online) {
    bg.play();
    emoji.setAttribute("hidden", "true")
  } else {
    emoji.removeAttribute("hidden")
  }
  if (RushMode && playWithBot) {
    botPlay();
  }
  if (online) {
    yourName = prompt("Enter Name");
    if (yourName == null || yourName === "") {
      yourName = "Random";
    }
    socket.emit("new-user-joined", yourName);
    model3.showModal();
    // dataTurn[0].innerText = yourName;
  }
}
function Reset() {
  boxes.forEach((box) => {
    box.innerText = "";
  });
  removeBotClass();
}

function removeSelectDrop(e) {
  if (!more_vert.contains(e.target)) {
    if (options.classList.contains("show")) {
      setTimeout(() => {
        options.classList.toggle("show");
      }, 100);
    }
  }
}

function changeTurn() {
  return turn === "X" ? "O" : "X";
}

function checkWin() {
  let texts = document.getElementsByClassName("box");
  let wins = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
  wins.forEach((e) => {
    if (texts[e[0]] !== "" && texts[e[1]] !== "" && texts[e[2]] !== "") {
    }
  });

  for (let i = 0; i < wins.length; i++) {
    const [a, b, c] = wins[i];
    if (
      texts[a - 1] &&
      texts[b - 1] &&
      texts[c - 1] &&
      texts[a - 1].innerText === texts[b - 1].innerText &&
      texts[c - 1].innerText === texts[b - 1].innerText &&
      texts[a - 1].innerText !== ""
    ) {
      if (texts[a - 1].innerText === "X") {
        texts[a - 1].classList.add("xWin");
        texts[b - 1].classList.add("xWin");
        texts[c - 1].classList.add("xWin");
        winner_box.style.backgroundImage =
          "linear-gradient(to right, #E74C3C, #F39C12)";
        playerName.innerText = playWithBot
          ? "You Won"
          : dataTurn[0].textContent + " Won";
        showOnlineWinnerName();

        addWinnerToList();
      } else {
        texts[a - 1].classList.add("yWin");
        texts[b - 1].classList.add("yWin");
        texts[c - 1].classList.add("yWin");
        winner_box.style.backgroundImage =
          "linear-gradient(to right, #007BFF, #00C2FF)";
        playerName.innerText = playWithBot
          ? "Computer Won"
          : dataTurn[1].textContent + " Won";

        showOnlineWinnerName();
        addWinnerToList();
      }
      gameover = true;
      setTimeout(() => {
        resetValues();
        setTimeout(() => {
          winSound.play();
          jsConfetti.addConfetti();
        }, 500);
      }, 2000);
      return wins[i];
    }
  }

  isDraw = true;
  for (let i = 0; i < texts.length; i++) {
    if (texts[i].innerText === "") {
      isDraw = false;
      break;
    }
  }

  if (isDraw) {
    winner_box.style.background = "orangered";
    drawSound.play();
    playerName.innerText = "Draw";
    resetValues();
  }

  return null;
}

function showOnlineWinnerName() {
  if (online) {
    playerName.innerText =
      initialTurn === "X" ? " You Wins" : onlinePlayerName + " Wins";
  }
}

function preventPlayerToTouch(bolean) {
  if (playWithBot) {
    if (bolean == "true") {
      addBotClass();
    } else if (bolean == "false") {
      removeBotClass();
    }
  }
}

function addBotClass() {
  boxes.forEach((box) => {
    box.classList.add("bot");
  });
}
function removeBotClass() {
  boxes.forEach((box) => {
    box.classList.remove("bot");
  });
}

function resetValues() {
  boxes.forEach((box) => {
    box.innerText = "";
  });
  winner_box.classList.add("show");
}

function addWinnerToList() {
  winnerList.push(playerName.textContent);
  updateChart(winnerList);
}

boxes.forEach((box, i) => {
  box.addEventListener("click", (e) => {
    if (e.target.innerText == "") {
      e.target.innerText = turn;
      e.target.classList.add("zIndex");
      tickSound.play();

      if (online) {
        OnlineInstance(i, turn);
        socket.emit("send", onlineMove);
        addBotClass();
        turn = changeTurn();
      }

      turn = changeTurn();
      checkTurn(turn);
      changehoverTurn(turn);
      checkWin();
      CreateBoardData();

      playWithBot ? botPlay() : performSuggestion();
      if (online) {
        checkTurn("O");
      }
    }
  });
});

function OnlineInstance(x, y) {
  if (online) {
    onlineMove.length = 0;
    onlineMove.push(x);
    onlineMove.push(y);
  }
}

function performSuggestion() {
  if (Suggestions) {
    CreateBoardData();
    data_sug.innerHTML = `Tick box ${findBestSpot(board) + 1
      } for better result`;
    let x = findBestSpot(board);
    highlight
      ? boxes[x].classList.add("highlight")
      : boxes[x].classList.remove("highlight");

    setTimeout(() => {
      boxes[x].classList.remove("highlight");
    }, 400);
  }
}

function CreateBoardData() {
  board.length = 0;
  boxes.forEach((box) => {
    board.push(box.innerText);
  });
}

function removeAllClasses() {
  boxes.forEach((box) => {
    if (box.classList.contains("xWin")) {
      box.classList.remove("xWin");
    } else if (box.classList.contains("yWin")) {
      box.classList.remove("yWin");
    }
    box.classList.remove("zIndex");
  });
}

function checkTurn(turn) {
  if (turn === "X") {
    bar.classList.remove("osTurn");
    document.body.classList.add("xTurn");
    document.body.classList.remove("yTurn");
    preventPlayerToTouch("false");
  } else {
    bar.classList.add("osTurn");
    preventPlayerToTouch("true");

    document.body.classList.remove("xTurn");
    document.body.classList.add("yTurn");
  }
  if (RushMode) {
    preventPlayerToTouch("true");
  }
}

function playAgains() {
  gameover = false;
  playSound.play();
  winner_box.classList.remove("show");
  removeAllClasses();

  if (playWithBot && turn === "O") {
    botPlay();
  }
  if (RushMode && turn === "X") {
    botPlay();
  }
  checkTurn(turn);
  changehoverTurn(turn);
}

function changehoverTurn(turn) {
  const root = document.documentElement;
  root.style.setProperty("--turn", `"${turn}"`);
}

const HUMAN_PLAYER = "X";
const AI_PLAYER = "O";

function checkWinner(board, player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (let pattern of winPatterns) {
    if (
      board[pattern[0]] === player &&
      board[pattern[1]] === player &&
      board[pattern[2]] === player
    ) {
      return true;
    }
  }

  return false;
}

function checkDraw(board) {
  return board.every((cell) => cell !== "");
}

function getAvailableSpots(board) {
  return board.reduce((spots, cell, index) => {
    if (cell === "") {
      spots.push(index);
    }
    return spots;
  }, []);
}

function minimax(board, depth, isMaximizing, alpha, beta) {
  if (checkWinner(board, AI_PLAYER)) {
    return 10 - depth;
  } else if (checkWinner(board, HUMAN_PLAYER)) {
    return depth - 10;
  } else if (checkDraw(board)) {
    return 0;
  }

  const availableSpots = getAvailableSpots(board);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let spot of availableSpots) {
      board[spot] = AI_PLAYER;
      const eval = minimax(board, depth + 1, false, alpha, beta);
      board[spot] = "";
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let spot of availableSpots) {
      board[spot] = HUMAN_PLAYER;
      const eval = minimax(board, depth + 1, true, alpha, beta);
      board[spot] = "";
      minEval = Math.min(minEval, eval);
      beta = Math.min(beta, eval);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function findBestSpot(board) {
  let bestEval = -Infinity;
  let bestSpot = null;

  const availableSpots = getAvailableSpots(board);

  for (let spot of availableSpots) {
    board[spot] = AI_PLAYER;
    const eval = minimax(board, 0, false, -Infinity, Infinity);
    board[spot] = "";

    if (eval > bestEval) {
      bestEval = eval;
      bestSpot = spot;
    }
  }

  return bestSpot;
}

function findEmptySpaces() {
  const emptySpaces = [];
  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      emptySpaces.push(index);
    }
  });
  return emptySpaces;
}
function botPlay() {
  const emptySpaces = findEmptySpaces();
  if (emptySpaces.length === 0 && !gameover) {
    return;
  }

  const randomIndex = findBestSpot(board);
  console.log(randomIndex);
  let selectedBox;
  selectedBox = boxes[randomIndex];
  if (selectedBox && selectedBox.innerText == "") {
    setBotMove(selectedBox);
  }
}

function setBotMove(selectedBox) {
  if (!gameover) {
    setTimeout(() => {
      selectedBox.innerText = turn;
      tickSound.play();
      turn = changeTurn();
      checkTurn(turn);
      changehoverTurn(turn);
      checkWin();
      selectedBox.classList.add("zIndex");
      performSuggestion();
      if (RushMode && !isDraw) {
        CreateBoardData();
        botPlay();
      }
    }, 1000);
  }
}

let myChart;
function createChart() {
  const ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["X Wins", "O Wins"],
      datasets: [
        {
          label: "Number of Wins",
          data: [0, 0],
          backgroundColor: [
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 99, 132, 0.5)",
          ],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function updateChart(winnerList) {
  let xWins = 0;
  let oWins = 0;

  for (let i = 0; i < winnerList.length; i++) {
    if (winnerList[i] === "X Won") {
      xWins++;
    } else if (winnerList[i] === "O Won") {
      oWins++;
    }
  }

  myChart.data.datasets[0].data = [xWins, oWins];
  myChart.update();
}

function feedback() {
  window.location.href = "https://forms.gle/YRpaQ15rLoR7TLs86";
}

document.body.addEventListener("click", removeSelectDrop);
initGame();
