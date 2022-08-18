const url = "ws://localhost:8765";
const baseUrl = "https://mp3.zing.vn/";
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
      } else resolve();
    };
    req.open("GET", url);
    req.send();
  });
};

getSongKey = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");

  const secretValue =
    doc.getElementsByClassName("player mt0")[0].attributes["data-xml"].value;

  return secretValue.split("key=")[1];
};

crawlSong = (songUrl) => {
  return new Promise((resolve) => {
    const url = `${baseUrl}${songUrl}`;
    const req = new XMLHttpRequest();
    req.onload = () => {
      if (req.status === 200) {
        resolve(getSongKey(req.response));
      } else resolve();
    };
    req.open("GET", url);
    req.send();
  });
};

function handleMessage(res, sender, sendResponse) {
  console.log("Incoming:", res);

  const { playing, song_url } = res;

  if (!playing) {
    return socket.send(JSON.stringify(res));
  }

  crawlSong(song_url).then((key) => {
    if (key.length > 0) res.key = key;

    const songData = JSON.stringify(res);
    socket.send(songData);
  });
}

socket.onopen = function () {
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
