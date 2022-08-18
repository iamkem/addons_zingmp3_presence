document.body.style.border = "5px solid red";
const audio = document.querySelector("audio");
const runTime = browser.runtime;

function notifyBackgroundPage(data) {
  runTime.sendMessage(data);
}

audio.addEventListener("play", () => {
  const songTitle = document.getElementsByClassName("song-title-item");
  const song_url = songTitle[0].querySelector("a").href.split("zingmp3.vn/")[1];

  notifyBackgroundPage({ playing: true, song_url });
});

audio.addEventListener("pause", () => {
  notifyBackgroundPage({ playing: false });
});
