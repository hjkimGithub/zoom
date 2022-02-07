const socket = io();

const welcome  = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value)
}  

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
      addMessage(`You: ${value}`);
    });
    input.value = "";
}  

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const nameForm = room.querySelector("#name");
    const msgForm = room.querySelector("#msg");
    nameForm.addEventListener("submit", handleNicknameSubmit);
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} joined!`);
});

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${left} left..`);
});
  
socket.on("new_message", addMessage);

// socket.on("room_change", (msg) => console.log(msg));
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerText = "";
    if(rooms.length === 0) {
        roomList.innerText = "";
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
});



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
