let $ = document;

let counter = 0;

const button = $.getElementById("btn");
const display = $.getElementById("counter");

if (window.localStorage.getItem("clickCount")) {
  count = window.localStorage.getItem("clickCount");
} else {
  count = 0;
}

display.innerHTML = counter;

button.onclick(function () {
    counter++;
    window.localStorage.setItem("clickCount", counter);
    display.innerHTML = counter;
});
