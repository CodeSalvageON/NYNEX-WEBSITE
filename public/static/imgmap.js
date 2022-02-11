const toggleHover = document.getElementById("togglehover");
const toggleDrag = document.getElementById("toggledrag");
const body = document.querySelector("#main"); 
const windows = document.querySelector(".window");
const mwindow = document.getElementById("m-window");
const music = document.getElementById("music");

let isToggle = false;
let isDrag = false;
const socket = io();

toggleHover.onclick = function () {
  if (isToggle === false) {
    isToggle = true;
    body.classList.remove("hover");
  }

  else {
    isToggle = false;
    body.classList.add("hover");
  }
}

toggleDrag.onclick = function () {
  if (isDrag === false) {
    isDrag = true;
    mwindow.classList.remove("draggable");
    mwindow.classList.remove("ui-draggable");
    mwindow.classList.remove("ui-draggable-handle");
  }

  else {
    isDrag = false;
    mwindow.classList.add("draggable");
    mwindow.classList.add("ui-draggable");
    mwindow.classList.add("ui-draggable-handle");
  }
}

function getUpdate () {
  fetch ('/online')
  .then(response => response.text())
  .then(data => {
    if (parseInt(data) === NaN) {
      document.getElementById("online").innerText = "Connect the Web!";
    }

    else {
      document.getElementById("online").innerText = "Connected Users: " + data;
    }
  })
  .catch(error => {
    console.log(error);
  });
}

setInterval(getUpdate, 500);

$("#m-window").click(function () {
  document.getElementById("music").style.zIndex = "0";
  document.getElementById("m-window").style.zIndex = "1";
});

$("#music").click(function () {
  document.getElementById("music").style.zIndex = "1";
  document.getElementById("m-window").style.zIndex = "0";
});

$("#virtual-mall").click(function () {
  location.href = "/static/mall.html";
});