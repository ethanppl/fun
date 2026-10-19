const INPUT_NUM = 6;

let answer = Math.round(Math.random() * 10 ** INPUT_NUM);

let attempt = 0;
let isGameEnded = false;
const goodAttemptCount = Math.round(Math.log2(10 ** INPUT_NUM)) + 1;

let value = "";
let focusIndex = 0;

function getElements() {
  return Array.from(document.getElementById("otp-group").children);
}

function getClearBtn() {
  return document.getElementById("clear-btn");
}

function getSubmitBtn() {
  return document.getElementById("submit-btn");
}

function getResetBtn() {
  return document.getElementById("reset-btn");
}

function getAttemptText() {
  return document.getElementById("attempt-text");
}

function handleFocusItem(e, i) {
  if (i === focusIndex) {
    e.focus();
    setTimeout(() => e.setSelectionRange(0, 0), 0);
  } else if (i === INPUT_NUM - 1 && focusIndex >= INPUT_NUM) {
    e.focus();
    setTimeout(() => e.setSelectionRange(0, 0), 0);
  }
}

function updateFocus() {
  // console.log(`updateFocus to ${focusIndex}`);
  const elements = getElements();
  elements.forEach((e, i) => {
    handleFocusItem(e, i);
  });
}

function updateValue(newValue) {
  if (newValue.length > INPUT_NUM) {
    newValue.substring(0, INPUT_NUM);
  }

  const elements = getElements();
  elements.forEach((e, i) => {
    if (i > newValue.length) {
      e.classList.toggle("caret-transparent", false);
      e.disabled = true;
      e.value = "";
    }

    if (i == newValue.length) {
      e.classList.toggle("caret-transparent", false);
      e.disabled = false;
      e.value = "";
    }

    if (i < newValue.length) {
      e.classList.toggle("caret-transparent", true);
      e.disabled = false;
      e.value = newValue[i];
    }

    handleFocusItem(e, i);
  });

  value = newValue;

  if (value.length == INPUT_NUM) {
    if (focusIndex >= INPUT_NUM) {
      submit();
    }
    getSubmitBtn().disabled = false;
    getClearBtn().disabled = false;
  } else if (value.length === 0) {
    getSubmitBtn().disabled = true;
    getClearBtn().disabled = true;
  } else {
    getSubmitBtn().disabled = true;
    getClearBtn().disabled = false;
  }
}

function updateAttemptText() {
  const node = getAttemptText();
  node.style.opacity = "50%";
  node.innerText = `Attempt: ${attempt}`;
}

function onGameEnded() {
  getClearBtn().hidden = true;
  getSubmitBtn().hidden = true;
  getResetBtn().hidden = false;
  getAttemptText().innerText = `Correct on attempt ${attempt}, ${attempt <= goodAttemptCount ? "not bad!" : "can be better!"}`;
}

function submit() {
  setTimeout(() => {
    const guess = parseInt(value);
    isGameEnded = guess == answer;
    attempt += 1;

    updateAttemptText();
    if (isGameEnded) {
      onGameEnded();
    }

    const isAnswerHigher = guess < answer;
    const s =
      value.length === INPUT_NUM
        ? `Submitted '${value}', ${isGameEnded ? "correct!" : isAnswerHigher ? "too low!" : "too high!"}`
        : `'${value}' is invalid.`;
    window.alert(s);

    updateFocus();
  }, 100);
}

function init() {
  const elements = getElements();

  elements.forEach((e, i) => {
    e.addEventListener("input", () => {
      if (isGameEnded) return;

      // cursor is moved to the first when handling focus
      const input = e.value.substring(0, 1);

      // console.log(i, e.value);
      if (!input.match(/\d/)) {
        updateValue(value);
        return;
      }

      const before = value.substring(0, i);
      const after = value.substring(i + 1, INPUT_NUM);
      const newValue = `${before}${input}${after}`;

      // console.log(newValue);
      focusIndex += 1;
      updateValue(newValue);
      return true;
    });

    e.addEventListener("keydown", (k) => {
      // console.log(i, k.code);
      focusIndex = i;

      if (k.code === "ArrowLeft") {
        focusIndex -= 1;
        updateFocus();
        return true;
      }

      if (k.code === "ArrowRight") {
        focusIndex += 1;
        updateFocus();
        return true;
      }

      if (isGameEnded) return true;

      if (k.code === "Enter" && value.length === INPUT_NUM) {
        submit();
      }

      if (k.code === "Backspace" || k.code === "Delete") {
        k.preventDefault();
        const hasValue = !!value[i];

        let newValue = "";
        if (hasValue) {
          const before = value.substring(0, i);
          const after = value.substring(i + 1, INPUT_NUM);
          newValue = `${before}${after}`;
        } else {
          newValue = value.substring(0, value.length - 1);
        }

        if (k.code === "Backspace") {
          focusIndex -= 1;
        }
        // console.log(newValue);
        updateValue(newValue);
        return true;
      }

      return false;
    });

    e.addEventListener("click", () => {
      focusIndex = i;
      updateFocus();
    });

    e.addEventListener("paste", (evt) => {
      evt.preventDefault();
      if (isGameEnded) return;
      let paste = (evt.clipboardData || window.clipboardData).getData("text");
      paste = paste.replace(/[^\d]*/g, "");

      // console.log("paste", i, paste);

      const before = value.substring(0, i);
      const newValue = (before + paste).substring(0, INPUT_NUM);

      focusIndex = i + paste.length;

      updateValue(newValue);
    });
  });

  updateValue("");
}

function setupClearBtn() {
  getClearBtn().addEventListener("click", () => {
    focusIndex = 0;
    updateValue("");
  });
}

function setupSubmitBtn() {
  getSubmitBtn().addEventListener("click", () => {
    submit();
  });
}

function setupResetBtn() {
  const resetBtn = getResetBtn();
  resetBtn.addEventListener("click", () => {
    isGameEnded = false;
    attempt = 0;
    answer = Math.round(Math.random() * 10 ** INPUT_NUM);
    getClearBtn().hidden = false;
    getSubmitBtn().hidden = false;
    resetBtn.hidden = true;
    const attemptText = getAttemptText();
    attemptText.innerText = "Attempt: 0";
    attemptText.style.opacity = "0%";

    focusIndex = 0;
    updateValue("");
  });
}

init();
setupClearBtn();
setupSubmitBtn();
setupResetBtn();
