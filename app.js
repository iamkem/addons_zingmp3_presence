document.body.style.border = "5px solid red";

function handleResponse(message) {
    console.log(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function notifyBackgroundPage(e) {
    let sending = browser.runtime.sendMessage({
        greeting: "Greeting from the content script"
    });
    sending.then(handleResponse, handleError);
}

// window.addEventListener("click", notifyBackgroundPage);

let audio = document.querySelector("audio");
console.log(audio);

audio.addEventListener("play", () => {
    console.log("playing");
    notifyBackgroundPage();
});

audio.addEventListener("pause", () => {
    console.log("pause");
});
