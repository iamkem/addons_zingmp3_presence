const url = "ws://localhost:8765";
const baseUrl = "https://mp3.zing.vn/";
const runTime = browser.runtime;

let socket;

let isConnected = false;

const message = { fromBackground: true };

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

getSongKeyPath = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");

  const mediaContent =
    doc.getElementsByClassName("media-content")[0] ??
    doc.getElementById("zplayerjs-wrapper");

  return mediaContent.attributes["data-xml"].value;
};

crawlSong = (songUrl) => {
  return new Promise((resolve) => {
    const url = `${baseUrl}${songUrl}`;
    const req = new XMLHttpRequest();
    req.onload = () => {
      if (req.status === 200) {
        resolve(getSongKeyPath(req.response));
      } else resolve();
    };
    req.open("GET", url);
    req.send();
  });
};

function handleToApp(res, sender, sendToContent) {
  if (isConnected) {
    console.log("Incoming:", res);

    const { playing, song_url } = res;

    if (!playing) {
      return socket.send(JSON.stringify(res));
    }

    crawlSong(song_url).then((path) => {
      if (path.length > 0) res.key_path = path;

      const songData = JSON.stringify(res);
      socket.send(songData);
    });
  }
}

function connect() {
  socket = new WebSocket(url);

  console.log("Connecting to", url);

  socket.onopen = function () {
    console.log("connected");
    isConnected = true;
  };

  socket.onclose = function () {
    console.log("disconnected...reconnect in seconds");
    isConnected = false;

    setTimeout(connect, 1000);
  };

  socket.onerror = function (error) {
    console.log("connect error:", error);
    socket.close();
  };
}

runTime.onMessage.addListener((msg) => {
  if (msg.fromContent) {
    handleToApp(msg.data);
  }
  if (msg.fromPopup) {
    runTime.sendMessage({ ...message, msg: { isConnected } });
  }
});

connect();
