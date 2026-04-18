const selectAllBtn = document.getElementById("select-all");
const categories = document.querySelectorAll(".checkbox");

const matchAnyPopover = document.getElementById("match-any-popover");
const matchAllPopover = document.getElementById("match-all-popover");
const matchAnyLabel = document.querySelector('label[for="matchAny"]');
const matchAllLabel = document.querySelector('label[for="matchAll"]');

selectAllBtn.addEventListener("click", (e) =>
  categories.forEach((cat) => (cat.checked = true)),
);

matchAnyLabel.addEventListener("mouseenter", () => {
  if (matchAnyPopover.style.display === "block") return;
  matchAnyPopover.style.display = "block";
  setTimeout(() => {
    matchAnyPopover.style.opacity = 100;
  }, 100);
  setTimeout(() => {
    matchAnyPopover.style.opacity = 0;
    setTimeout(() => {
      matchAnyPopover.style.display = "none";
    }, 200);
  }, 4000);
});

matchAllLabel.addEventListener("mouseenter", () => {
  if (matchAllPopover.style.display === "block") return;
  matchAllPopover.style.display = "block";
  setTimeout(() => {
    matchAllPopover.style.opacity = 100;
  }, 100);
  setTimeout(() => {
    matchAllPopover.style.opacity = 0;
    setTimeout(() => {
      matchAllPopover.style.display = "none";
    }, 200);
  }, 4000);
});

document.addEventListener("DOMContentLoaded", () => {
  const newSession = document.getElementById("newSession").value === "true";
  const loggedIn = document.getElementById("loggedIn").value === "true";
  console.log({ newSession });
  if (newSession) {
    const mainContent = document.getElementById("main");
    const loginBox = document.getElementById("log-in");
    loginBox.style.display = "flex";
    loginBox.style.opacity = "100";
    mainContent.classList.add("blur-sm");
    document.addEventListener("click", removeLogInBox);
  }
  if (loggedIn) {
  }
});

const removeLogInBox = (e) => {
  let elm = e.target;
  while (elm) {
    if (elm.id === "dismiss") break;
    if (elm.id === "warning") return;
    elm = elm.parentElement;
  }
  const mainContent = document.getElementById("main");
  mainContent.classList.remove("blur-sm");
  const loginBox = document.getElementById("log-in");
  loginBox.style.opacity = "0";
  setTimeout(() => {
    loginBox.style.display = "none";
  }, 300);
  document.removeEventListener("click", removeLogInBox);
};

document.getElementById("dismiss").addEventListener("click", removeLogInBox);
