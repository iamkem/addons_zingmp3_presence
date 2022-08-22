const audio = document.querySelector("audio");
const runTime = browser.runtime;

const message = { fromContent: true };

function handleResponse(message) {
  console.log("from bg:", message);
}

function handleError(error) {
  console.log(`Error: ${error.message}`);
}

function notifyBackgroundPage() {
  const sending = runTime.sendMessage(message);

  sending.then(handleResponse, handleError);
}

audio.addEventListener("play", () => {
  const songTitle = document.getElementsByClassName("song-title-item");
  const song_url = songTitle[0].querySelector("a").href.split("zingmp3.vn/")[1];
  const song_title = songTitle[0].innerText ?? songTitle[0].textContent;

  message.data = {
    playing: true,
    song_title,
    song_url,
    currentTime: audio.currentTime,
  };

  notifyBackgroundPage();
});

audio.addEventListener("pause", () => {
  message.data.playing = false;

  notifyBackgroundPage();
});

audio.addEventListener("seeked", () => {
  if (audio.paused) return;

  message.data.currentTime = audio.currentTime;

  notifyBackgroundPage();
});
