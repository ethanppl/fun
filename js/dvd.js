const BOUNCY_ELEMENT_ID = "fun-title";
const ANIMATION_INTERVAL_MS = 10;

const SPEED = 50;
const PADDING = 3;

const VARIATIONS = [
  "For Fun!",
  "<i>DVD</i>",
  "Pam claims that she saw it.",
  "I saw it, and it was amazing!",
  "That was so awesome.",
  "Will it hit?",
  "Pure luck. Pure joy.",
  "It was only a matter of time.",
  "Be patient!",
  "Eventually...",
  "Barely missed?",
];

const SATURATION = "55%"
const LIGHTNESS = "40%"

function main() {
  const element = document.getElementById(BOUNCY_ELEMENT_ID);

  if (element == null) {
    console.warn(`Cannot find element with ID ${BOUNCY_ELEMENT_ID}, exiting.`);
    return;
  }

  const randIdx = Math.round(Math.random() * VARIATIONS.length) % VARIATIONS.length;
  element.innerHTML = VARIATIONS[randIdx];

  let elementWidth = element.offsetWidth;
  let elementHeight = element.offsetHeight;

  // Setup
  let winWidth = document.documentElement.scrollWidth;
  let winHeight = document.documentElement.scrollHeight;

  element.style.position = "absolute";
  let top = Math.round(Math.random() * (winHeight - elementHeight));
  let left = Math.round(Math.random() * (winWidth - elementWidth));
  element.style.top = top;
  element.style.left = left;

  let isGoingDown = Math.random() > 0.5;
  let isGoingRight = Math.random() > 0.5;
  const deltaDistance = SPEED * ANIMATION_INTERVAL_MS / 1000;

  // Draw animation
  setInterval(animate, ANIMATION_INTERVAL_MS);

  function animate() {
    elementWidth = element.offsetWidth;
    elementHeight = element.offsetHeight;

    winWidth = document.documentElement.scrollWidth;
    winHeight = document.documentElement.scrollHeight;

    [top, isGoingDown] = pingPong(
      0, 
      winHeight - elementHeight - PADDING * 2,
      top,
      deltaDistance,
      isGoingDown
    );

    [left, isGoingRight] = pingPong(
      0, 
      winWidth - elementWidth - PADDING * 2,
      left,
      deltaDistance,
      isGoingRight
    );

    element.style.top = top + PADDING;
    element.style.left = left + PADDING;
  }
}

function randomizeColour() {
  const element = document.getElementById(BOUNCY_ELEMENT_ID);
  const hue = Math.round(Math.random() * 360) % 360;
  element.style.color = `hsl(${hue}, ${SATURATION}, ${LIGHTNESS})`;
}

function pingPong(min, max, current, inputDelta, isPositiveDirection) {
  let output = current;
  let direction = isPositiveDirection;

  if (min == max) {
    return [output, direction];
  }

  let maxDistance = Math.abs(max - min);
  let delta = inputDelta % maxDistance;

  if (isPositiveDirection) {
    output += delta;
  } else {
    output -= delta;
  }

  if (output < min) {
    output = min - output;
    direction = !direction;
    randomizeColour();
  }

  if (output > max) {
    output = max - (output - max);
    direction = !direction;
    randomizeColour();
  }

  return [output, direction];
}

main();
