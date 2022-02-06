const socket = io();

const welcome  = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", {payload:input.value}, () =>{
        console.log("Server is done");
    });
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

// const msgList = document.querySelector("ul");
// const nickForm  = document.querySelector("#nickname");
// const msgForm  = document.querySelector("#message");
// const socket = new WebSocket(`ws://${window.location.host}`);

// function makeMessage(type, payload) {
//     const msg = {type, payload};
//     return JSON.stringify(msg);
// }

// socket.addEventListener("open", () => {
//     console.log("Connected to Server!");
// });

// socket.addEventListener("message", (message) => {
//     const li = document.createElement("li");
//     li.innerText = message.data;
//     msgList.append(li);
//     // console.log(message.data, "from the Server!");
// });

// socket.addEventListener("close", () => {
//     console.log("Disconnected from the Server!");
// });

// function handleMsgSubmit(event) {
//     event.preventDefault();
//     const input = msgForm.querySelector("input");
//     // console.log(input.value);
//     socket.send(makeMessage("message", input.value));
//     input.value = "";
// }

// function handleNickSubmit(event) {
//     event.preventDefault();
//     const input = nickForm.querySelector("input");
//     socket.send(makeMessage("nickname", input.value));
//     input.value = "";
// }

// nickForm.addEventListener("submit", handleNickSubmit);
// msgForm.addEventListener("submit", handleMsgSubmit);

// setTimeout(() => {
//     socket.send("Hello from the browser!");
// }, 10000);
