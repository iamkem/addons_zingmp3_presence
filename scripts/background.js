console.log("background script loaded");

const baseUrl = "https://mp3.zing.vn/";

const url = "ws://localhost:8765";

const runTime = browser.runtime;

const socket = new WebSocket(url);

getSongData = (key) => {
    return new Promise((resolve) => {
        const url = `${baseUrl}xhr/media/get-source?type=audio&key=${key}`;
        const req = new XMLHttpRequest();
        req.onload = () => {
            if (req.status === 200) {
                const data = JSON.parse(req.response);
                const songData = data.data;
                resolve(songData);
            }
            else resolve();
        }
        req.open("GET", url);
        req.send();
    });
}

getSongKey = (data) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    const secretValue = doc
        .getElementsByClassName("player mt0")[0]
        .attributes["data-xml"].value

    return secretValue.split("key=")[1];
}

crawlSong = (songUrl) => {
    const url = `${baseUrl}${songUrl}`;
    const req = new XMLHttpRequest();
    req.onload = () => {
        if (req.status === 200) {
            const key = getSongKey(req.response);
            getSongData(key)
                .then((res) => {
                    console.log(res);
                });
        }
    }
    req.open("GET", url);
    req.send();
};

function handleMessage(res, sender, sendResponse) {
    console.log("From content script:", res);
    crawlSong(res.song_url);
    // sendResponse({ response: "Response from background script" });
}

socket.onopen = function () {
    console.log("connected");
    socket.send("Fuck you!");

    runTime.onMessage.addListener(handleMessage);
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


