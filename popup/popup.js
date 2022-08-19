const $ = document;
const runTime = browser.runtime;

runTime.sendMessage({ fromPopup: true, msg: "Check status from popup!" });

runTime.onMessage.addListener((res) => {
  if (res.fromBackground) {
    const { msg } = res;

    if (msg.isConnected) {
      $.getElementsByClassName("disconnected")[0].style.display = "none";
      $.getElementsByClassName("connected")[0].style.display = "inline-block";
    }
  }
});
