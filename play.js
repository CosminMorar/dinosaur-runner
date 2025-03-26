const FLOOR_POSITION = 300;
const JUMP_SPEED = 9;
const GRAVITY = 0.2;
let gameIsPlaying = false, time, upSpeed, pressedKeys = {}, cactusesCount, lastRemovedCactusIndex;

/// Setup pressed keys tracking for dinosaur jumping
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

function onKeyDown(event) {
  pressedKeys[event.key] = true;

  /// Trigger the start of the game
  if (!gameIsPlaying && pressedKeys[' ']) {
    startGame();
  }
}

function onKeyUp(event) {
  pressedKeys[event.key] = false;
}

function moveDinosaur() {
  let dinosaur = document.getElementById('dinosaur');
  let curPos = parseInt(dinosaur.style.top);

  /// Make dinosaur jump
  if (pressedKeys[' '] && curPos == FLOOR_POSITION) {
    upSpeed = JUMP_SPEED;
  }

  /// Update the position of the dinosaur
  dinosaur.style.top = Math.min(curPos - upSpeed, FLOOR_POSITION) + "px";

  /// Update the upSpeed of the dinosaur by applying the gravity force
  upSpeed = upSpeed - GRAVITY;
}

function createCactus() {
  ++cactusesCount;
  document.getElementsByClassName('game-container')[0].innerHTML +=
    '<img class="cactus" id="cactus-' +
    cactusesCount +
    '" src="cactus.png" alt="cactus png missing" style="top: 280px; left: 940px;">';
}

function moveCactuses() {
  for (let i = lastRemovedCactusIndex + 1; i <= cactusesCount; ++i) {
    let cactus = document.getElementById('cactus-' + i);
    cactus.style.left = (parseInt(cactus.style.left) - 2) + "px";
    if (parseInt(cactus.style.left) == 0) {
      cactus.remove();
      lastRemovedCactusIndex = i;
    }
  }
}

function updateGame() {
  moveDinosaur();
  ++time;
  if (time % 200 == 0) {
    createCactus();
  }
  moveCactuses();
}

function startGame() {
  gameIsPlaying = true;

  /// Delete everything from the past game (if any) and create the dinosaur
  document.getElementsByClassName('game-container')[0].innerHTML =
    '<img id="dinosaur" src="dinosaur.png" alt="dinosaur png missing" style="top: ' +
    FLOOR_POSITION +
    'px; left: 50px;">';

  /// Setup dinosaur movement
  upSpeed = 0;
  pressedKeys = {};

  /// Start playing
  time = 0;
  cactusesCount = 0;
  lastRemovedCactusIndex = 0;
  let playInterval = window.setInterval(updateGame, 5);
}
