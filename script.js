const inputSlider = document.querySelector("[data-LengthSlider]");
const lengthDisplay = document.querySelector("[data-LengthNumber]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numberCaseCheck = document.querySelector("#numbers");
const symbolCaseCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const passwordDisplay = document.querySelector("[data-PasswordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMssg = document.querySelector("[data-CopyMssg]");
const allCheckBoxes = document.querySelectorAll("input[type = checkbox]");

const symbols = "@#$%^&*()!~_+={}[]|:;?></-";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// ** set strenth color to grey; **
setIndicator("#ccc");

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.textContent = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function generateNumber() {
  return getRandomInteger(0, 9);
}

function generateUppercase() {
  return String.fromCharCode(getRandomInteger(65, 90));
}

function generateLowercase() {
  return String.fromCharCode(getRandomInteger(97, 122));
}

function generateSymbol() {
  let symbolIndex = getRandomInteger(0, symbols.length);
  return symbols.charAt(symbolIndex);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (upperCaseCheck.checked) {
    hasUpper = true;
  }

  if (lowerCaseCheck.checked) {
    hasLower = true;
  }

  if (numberCaseCheck.Checked) {
    hasNumber = true;
  }

  if (symbolCaseCheck.checked) {
    hasSymbol = true;
  }

  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasUpper || hasLower) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  console.log("copy cintnent inside");
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMssg.textContent = "copied...";
  } catch (error) {
    console.error("error:", error);
    copyMssg.textContent = "failed...";
  }
  copyMssg.classList.add("active");
  setTimeout(() => {
    copyMssg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  console.log("copybtn");
  if (passwordDisplay.value) {
    console.log("copybtn1");
    copyContent();
  }
});

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBoxes.forEach((item) => {
    if (item.checked) {
      checkCount++;
    }
  });
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBoxes.forEach((item) => {
  item.addEventListener("change", handleCheckBoxChange);
});

function shufflePassword(password) {
  // **Fisher yates method : algo to shuffle an array elements:**

  for (let i = password.length - 1; i >= 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = password[i];
    password[i] = password[j];
    password[j] = temp;
  }
  let str = "";
  password.forEach((item) => {
    str += item;
  });
  return str;
}

generateBtn.addEventListener("click", () => {
  // if all checkboxes are unchecked ->

  if (checkCount == 0) {
    passwordDisplay.value = "";
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // remove old password:

  password = "";

  let arr = [];

  if (upperCaseCheck.checked) {
    arr.push(generateUppercase);
  }

  if (lowerCaseCheck.checked) {
    arr.push(generateLowercase);
  }

  if (numberCaseCheck.checked) {
    arr.push(generateNumber);
  }

  if (symbolCaseCheck.checked) {
    arr.push(generateSymbol);
  }

  for (let i = 0; i < arr.length; i++) {
    password += arr[i]();
  }

  for (let i = 0; i < passwordLength - arr.length; i++) {
    let randIndex = getRandomInteger(0, arr.length - 1);

    password += arr[randIndex]();
  }

  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  calcStrength();
});
