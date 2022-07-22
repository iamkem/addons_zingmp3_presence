console.log("background script loaded");

const url = "ws://localhost:8765";

function handleMessage(request, sender, sendResponse) {
    console.log("Message from the content script: " +
        request.greeting);
    sendResponse({response: "Response from background script"});
}

browser.runtime.onMessage.addListener(handleMessage);

// let audio = document.querySelector("audio");
// console.log(audio);
//
// audio.addEventListener("play", () => {
//     console.log("playing");
// });
//
// audio.addEventListener("pause", () => {
//     console.log("pause");
// });

// const socket = new WebSocket(url);
//
// socket.onopen = function () {
//     console.log("connected");
//     socket.send("Fuck you!");
// };
//
// socket.onmessage = function (msg) {
//     console.log("message:", msg.data);
// };
//
// socket.onerror = function (err) {
//     console.log("connect error:", err.message);
// };
//
// socket.onclose = function () {
//     console.log("disconnected");
// };


