const audio = document.querySelector("audio");
const runTime = browser.runtime;

let message = {};

function notifyBackgroundPage() {
  runTime.sendMessage(message);
}

audio.addEventListener("play", () => {
  const songTitle = document.getElementsByClassName("song-title-item");
  const song_url = songTitle[0].querySelector("a").href.split("zingmp3.vn/")[1];

  message = {
    playing: true,
    song_url,
    currentTime: audio.currentTime,
  };

  notifyBackgroundPage();
});

audio.addEventListener("pause", () => {
  message = { playing: false };

  notifyBackgroundPage();
});

audio.addEventListener("seeked", () => {
  if (audio.paused) return;

  message.currentTime = audio.currentTime;

  notifyBackgroundPage();
});
