const INPUT_NUM = 6;

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

function submit() {
  setTimeout(() => {
    const s =
      value.length === INPUT_NUM
        ? `Submitted '${value}'`
        : `'${value}' is invalid.`;
    window.alert(s);
    updateFocus();
  }, 100);
}

function init() {
  const elements = getElements();

  elements.forEach((e, i) => {
    e.addEventListener("input", () => {
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

      if (k.code === "Enter" && value.length === INPUT_NUM) {
        submit();
      }

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

init();
setupClearBtn();
setupSubmitBtn();
