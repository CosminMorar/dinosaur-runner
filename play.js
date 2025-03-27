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

/// Cactus starting position
const CACTUS_START_TOP_POSITION = GAME_HEIGHT - CACTUS_HEIGHT;
const CACTUS_START_LEFT_POSITION = GAME_WIDTH - CACTUS_WIDTH;

/// Game speed (lower = faster)
const GAME_PLAY_SPEED = 5;
const CACTUS_CREATION_SPEED = 200;
const CACTUS_HORIZONTAL_MOVING_SPEED = 2;
const SCORE_UPDATE_RATE = 10;

/// Dinosaur jumping
const JUMP_SPEED = 9;
const GRAVITY = 0.2;

/// Collision slippages
const COLLISION_SLIPPAGE_LEFT = 15;
const COLLISION_SLIPPAGE_TOP = 10;
const COLLISION_SLIPPAGE_WIDTH = 2 * COLLISION_SLIPPAGE_LEFT;
const COLLISION_SLIPPAGE_HEIGHT = 2 * COLLISION_SLIPPAGE_TOP;

/// Sound files
const GAME_START_SOUND_FILE_NAME = 'jump-sound.mp3';
const JUMP_SOUND_FILE_NAME = 'jump-sound.mp3';
const LOST_SOUND_FILE_NAME = 'lost-sound.mp3';
const POINTS_ACHIEVEMENT_SOUND_FILE_NAME = '100-points-sound.mp3';

/// Achievements
const POINTS_FOR_ACHIEVEMENT = 100;

let gameIsPlaying = false, gameTick;
let time, upSpeed, pressedKeys = {}, cactusesCount, lastRemovedCactusIndex;

/// Setup pressed keys tracking for dinosaur jumping
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

function onKeyDown(event) {
  pressedKeys[event.key] = true;

  /// Trigger the start of the game if not playing yet
  if (!gameIsPlaying && pressedKeys[' ']) {
    startGame();
  }
}

function onKeyUp(event) {
  pressedKeys[event.key] = false;
}

function playSound(soundFileName) {
  const sound = new Audio(soundFileName);
  sound.play();
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
    (rectDinosaur.top + rectDinosaur.height < rectCactus.top) ||
    (rectDinosaur.top > rectCactus.top + rectCactus.height) ||
    (rectDinosaur.left + rectDinosaur.width < rectCactus.left) ||
    (rectDinosaur.left > rectCactus.left + rectCactus.width)
  );
}

function moveDinosaur() {
  let dinosaur = document.getElementById('dinosaur');
  let curPos = parseInt(dinosaur.style.top);

  /// Make dinosaur jump
  if (pressedKeys[' '] && curPos === DINOSAUR_START_TOP_POS) {
    upSpeed = JUMP_SPEED;
    playSound(JUMP_SOUND_FILE_NAME);
  }

  /// Update dinosaur position
  dinosaur.style.top = Math.min(curPos - upSpeed, DINOSAUR_START_TOP_POS) + "px";
  upSpeed = upSpeed - GRAVITY; // apply gravity

  /// Check collision
  if (dinosaurHitCactus()) {
    gameIsPlaying = false;
    playSound(LOST_SOUND_FILE_NAME);
    clearInterval(gameTick);
    updateHighScore();
  }
}

function createCactus() {
  ++cactusesCount;
  document.getElementsByClassName('game-container')[0].innerHTML += `
    <img class="cactus" id="cactus-${cactusesCount}"
         src="cactus.png" alt="cactus png missing"
         style="
           top: ${CACTUS_START_TOP_POSITION}px;
           left: ${CACTUS_START_LEFT_POSITION}px;
           width: ${CACTUS_WIDTH}px;
           height: ${CACTUS_HEIGHT}px;
         ">`;
}

function moveCactuses() {
  for (let i = lastRemovedCactusIndex + 1; i <= cactusesCount; ++i) {
    let cactus = document.getElementById(`cactus-${i}`);
    cactus.style.left =
      (parseInt(cactus.style.left) - CACTUS_HORIZONTAL_MOVING_SPEED) + "px";
    if (parseInt(cactus.style.left) <= 0) {
      cactus.remove();
      lastRemovedCactusIndex = i;
    }
  }
}

function createDinosaur() {
  document.getElementsByClassName('game-container')[0].innerHTML += `
    <img id="dinosaur" src="dinosaur.png" alt="dinosaur png missing"
         style="
           top: ${DINOSAUR_START_TOP_POS}px;
           left: ${DINOSAUR_START_LEFT_POS}px;
           width: ${DINOSAUR_WIDTH}px;
           height: ${DINOSAUR_HEIGHT}px;
         ">`;
}

function createGameBoard() {
  // Skip if there's already a Game Board
  if (document.getElementsByClassName('game-container').length) {
    return;
  }

  // Create the Game Board
  document.querySelector('.container').innerHTML += `
    <div class="game-container"
         style="width: ${GAME_WIDTH}px; height: ${GAME_HEIGHT}px;">
    </div>`;
}

function updateScore() {
  let score = document.getElementById('score');
  score.innerHTML = time / SCORE_UPDATE_RATE;
  // Play achievement sound for each 100 points achieved
  if (time / SCORE_UPDATE_RATE % POINTS_FOR_ACHIEVEMENT === 0) {
    playSound(POINTS_ACHIEVEMENT_SOUND_FILE_NAME);
  }
}

function updateHighScore() {
  let score = document.getElementById('score');
  let highScore = document.getElementById('high-score');
  highScore.innerHTML = Math.max(
    parseInt(score.innerHTML),
    parseInt(highScore.innerHTML)
  );
}

function updateGame() {
  moveDinosaur();
  ++time;

  // Periodically create new cactus
  if (time % CACTUS_CREATION_SPEED === 0) {
    createCactus();
  }

  moveCactuses();

  // Update the score at a certain rate
  if (time % SCORE_UPDATE_RATE === 0) {
    updateScore();
  }
}

function startGame() {
  gameIsPlaying = true;

  // Create the Game Board if it doesn't exist
  createGameBoard();
  // Clear out old dinosaurs/cacti
  document.getElementsByClassName('game-container')[0].innerHTML = '';

  // Create dinosaur
  createDinosaur();
  upSpeed = 0;
  pressedKeys = {};

  // Initialize game variables
  time = 0;
  cactusesCount = 0;
  lastRemovedCactusIndex = 0;

  // Play a sound to indicate game start
  playSound(GAME_START_SOUND_FILE_NAME);

  // Start the main game loop
  gameTick = window.setInterval(updateGame, GAME_PLAY_SPEED);
}
