/// Game Board sizing
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 400;

/// Dinosaur sizing
const DINOSAUR_WIDTH = 80;
const DINOSAUR_HEIGHT = 80;

/// Cactus sizing
const CACTUS_WIDTH = 60;
const CACTUS_HEIGHT = 100;

/// Dinosaur starting position
const DINOSAUR_START_LEFT_POS = DINOSAUR_WIDTH;
const DINOSAUR_START_TOP_POS = GAME_HEIGHT - DINOSAUR_HEIGHT;

/// Cactus starting position (when created)
const CACTUS_START_TOP_POSITION = GAME_HEIGHT - CACTUS_HEIGHT;
const CACTUS_START_LEFT_POSITION = GAME_WIDTH - CACTUS_WIDTH;

/// Game speed (lower = faster)
const GAME_PLAY_SPEED = 5;
const CACTUS_CREATION_SPEED = 200;
const CACTUS_HORIZONTAL_MOVING_SPEED = 2;

/// Dinosaur jumping
const JUMP_SPEED = 9;
const GRAVITY = 0.2;

/// Collision Slippages
const COLLISION_SLIPPAGE_LEFT = 15;
const COLLISION_SLIPPAGE_TOP = 10;
const COLLISION_SLIPPAGE_WIDTH = 2 * COLLISION_SLIPPAGE_LEFT;
const COLLISION_SLIPPAGE_HEIGHT = 2 * COLLISION_SLIPPAGE_TOP;

let gameIsPlaying = false, gameTick;
let time, upSpeed, pressedKeys = {}, cactusesCount, lastRemovedCactusIndex;

/// Setup pressed keys tracking for dinosaur jumping
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

function onKeyDown(event) {
  pressedKeys[event.key] = true;

  /// Trigger the start of the game if the game is not playing already
  if (!gameIsPlaying && pressedKeys[' ']) {
    startGame();
  }
}

function onKeyUp(event) {
  pressedKeys[event.key] = false;
}

function applyCollisionSlippage(el) {
  el.left += COLLISION_SLIPPAGE_LEFT;
  el.top += COLLISION_SLIPPAGE_TOP;
  el.width -= COLLISION_SLIPPAGE_WIDTH;
  el.height -= COLLISION_SLIPPAGE_HEIGHT;
  return el;
}

function dinosaurHitCactus() {
  let dinosaur = document.getElementById('dinosaur');
  let cactus = document.getElementById(`cactus-${lastRemovedCactusIndex + 1}`);
  if (!cactus) {
    return false;
  }
  let rectDinosaur = applyCollisionSlippage(dinosaur.getBoundingClientRect());
  let rectCactus = applyCollisionSlippage(cactus.getBoundingClientRect());
  return !(
      ((rectDinosaur.top + rectDinosaur.height) < (rectCactus.top)) ||
      (rectDinosaur.top > (rectCactus.top + rectCactus.height)) ||
      ((rectDinosaur.left + rectDinosaur.width) < rectCactus.left) ||
      (rectDinosaur.left > (rectCactus.left + rectCactus.width))
  );
}

function moveDinosaur() {
  let dinosaur = document.getElementById('dinosaur');
  let curPos = parseInt(dinosaur.style.top);

  /// Make dinosaur jump
  if (pressedKeys[' '] && curPos == DINOSAUR_START_TOP_POS) {
    upSpeed = JUMP_SPEED;
  }

  /// Update the position of the dinosaur
  dinosaur.style.top = Math.min(curPos - upSpeed, DINOSAUR_START_TOP_POS) + "px";

  /// Update the upSpeed of the dinosaur by applying the gravity force
  upSpeed = upSpeed - GRAVITY;

  /// Stop the game if the dinosaur hit a cactus
  if (dinosaurHitCactus()) {
    gameIsPlaying = false;
    clearInterval(gameTick);
  }
}

function createCactus() {
  ++cactusesCount;
  document.getElementsByClassName('game-container')[0].innerHTML +=
    `<img class="cactus" id="cactus-${cactusesCount}" src="cactus.png" alt="cactus png missing" style="
    top: ${CACTUS_START_TOP_POSITION}px; left: ${CACTUS_START_LEFT_POSITION}px;
    width: ${CACTUS_WIDTH}px; height: ${CACTUS_HEIGHT}px;">`;
}

function moveCactuses() {
  for (let i = lastRemovedCactusIndex + 1; i <= cactusesCount; ++i) {
    let cactus = document.getElementById(`cactus-${i}`);
    cactus.style.left = (parseInt(cactus.style.left) - CACTUS_HORIZONTAL_MOVING_SPEED) + "px";
    if (parseInt(cactus.style.left) == 0) {
      cactus.remove();
      lastRemovedCactusIndex = i;
    }
  }
}

function createDinosaur() {
  document.getElementsByClassName('game-container')[0].innerHTML +=
    `<img id="dinosaur" src="dinosaur.png" alt="dinosaur png missing" style="
    top: ${DINOSAUR_START_TOP_POS}px; left: ${DINOSAUR_START_LEFT_POS}px;
    width: ${DINOSAUR_WIDTH}px; height: ${DINOSAUR_HEIGHT}px">`;
}

function createGameBoard() {
  /// Stop if the Game Board already exists from a previous game
  if (document.getElementsByClassName('game-container').length) {
    return;
  }

  /// Create the Game board
  document.body.innerHTML += `<div class="game-container" style="
    width: ${GAME_WIDTH}px; height: ${GAME_HEIGHT}px;">`;
}

function updateGame() {
  moveDinosaur();
  ++time;
  if (time % CACTUS_CREATION_SPEED == 0) {
    createCactus();
  }
  moveCactuses();
}


function startGame() {
  gameIsPlaying = true;

  /// Delete everything from the past game (if any)
  createGameBoard();
  document.getElementsByClassName('game-container')[0].innerHTML = '';

  /// Dinosaur setup
  createDinosaur();
  upSpeed = 0;
  pressedKeys = {};

  /// Start playing
  time = 0;
  cactusesCount = 0;
  lastRemovedCactusIndex = 0;
  gameTick = window.setInterval(updateGame, GAME_PLAY_SPEED);
}
