document.body.style.border = "5px solid red";
const audio = document.querySelector("audio");
const runTime = browser.runtime;

function handleResponse(message) {
    console.log(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function notifyBackgroundPage(data) {
    runTime
        .sendMessage(data);
        // .then(handleResponse, handleError);
}

audio.addEventListener("play", () => {
    console.log("playing");
    const data = { playing: true };
    const songTitle = document.getElementsByClassName("song-title-item");

    data.song_url = songTitle[0].querySelector("a").href.split("zingmp3.vn/")[1];

    notifyBackgroundPage(data);
});

audio.addEventListener("pause", () => {
    const data = {
        playing: false,
    };
    notifyBackgroundPage(data);
});
