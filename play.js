const FLOOR_POSITION = 300;
const JUMP_SPEED = 35;
const GRAVITY = 4;
let gameIsPlaying = false, upSpeed, pressedKeys = {};

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
  upSpeed -= GRAVITY;
}

function updateGame() {
  moveDinosaur();
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

  /// Update the game
  let playInterval = window.setInterval(updateGame, 50);
}
