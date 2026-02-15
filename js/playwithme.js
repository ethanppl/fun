let attemptCount = 0;
let maxAttempts = 20;

// Initial button size in rem
let yesSize = 1.5;
let noSize = 0.75;

// When no is click, how much bigger does the button gets
let yesMultiplier = 1.1;
let noMultiplier = 0.9;

// The size of padding, a multiply of the font size
let verticalPaddingFactor = 1 + 1/3
let horizontalPaddingFactor = verticalPaddingFactor * 2;

function init() {
  setSizes();

  let maxWidth = document.documentElement.scrollWidth;
  let maxHeight = document.documentElement.scrollHeight;

  let yesBtn = document.getElementById("playwithme-yes");
  let btnRow = document.getElementById("playwithme-button-row")

  console.log(`w: ${maxWidth} h: ${maxHeight}`)
  btnRow.style.flexDirection = maxHeight > maxWidth ? "column" : "row";

  let maxFromWidth = Math.round(Math.log(maxWidth * 0.8 / yesBtn.offsetWidth) / Math.log(yesMultiplier));
  let maxFromHeight = Math.round(Math.log(maxHeight * 0.75 / yesBtn.offsetHeight) / Math.log(yesMultiplier));

  maxAttempts = Math.min(maxAttempts, maxFromHeight, maxFromWidth);
}

function setSizes() {
  let yesBtn = document.getElementById("playwithme-yes");
  let noBtn = document.getElementById("playwithme-no");

  yesBtn.style.fontSize = `${yesSize}rem`;
  yesBtn.style.padding = `${yesSize * verticalPaddingFactor}rem ${yesSize * horizontalPaddingFactor}rem`;

  noBtn.style.fontSize = `${noSize}rem`;
  noBtn.style.padding = `${noSize * verticalPaddingFactor}rem ${noSize * horizontalPaddingFactor}rem`;
}

function onYes() {
  let header = document.getElementById("playwithme-header");
  let yesBtn = document.getElementById("playwithme-yes");
  let noBtn = document.getElementById("playwithme-no");
  let resetBtn = document.getElementById("playwithme-reset");

  header.innerHTML = "I knew you would say yes &#x2665;&#xfe0f;";
  header.style.animation = "1s ease-in-out infinite playwithme-celebration"
  yesBtn.remove();

  if (noBtn) {
    noBtn.remove();
  }

  resetBtn.hidden = false;
}

function onNo() {
  if (attemptCount++ < maxAttempts) {
    yesSize *= yesMultiplier;
    noSize *= noMultiplier;

    setSizes();
  } else {
    let noBtn = document.getElementById("playwithme-no");
    noBtn.remove();
  }
}

function onReset() {
  location.reload();
}

init();

function detectAndApplyIOSClass() {
    // Check if the user agent string contains iOS device keywords
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Because somehow iOS cannot render transition properly!
    if (isIOS) {
      const elements = document.getElementsByClassName("playwithme-button");
      for (const element of elements) {
        element.style.transition = "none";
      }
    }
}

detectAndApplyIOSClass();
