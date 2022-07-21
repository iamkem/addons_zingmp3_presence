console.log("background script loaded");

const url = "ws://localhost:8765";

const socket = new WebSocket(url);

socket.onopen = function () {
    console.log("connected");
    socket.send("Fuck you!");
};

socket.onmessage = function (msg) {
    console.log("message:", msg.data);
};

socket.onerror = function (err) {
    console.log("connect error:", err.message);
};

socket.onclose = function () {
    console.log("disconnected");
};


