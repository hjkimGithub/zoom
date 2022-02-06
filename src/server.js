import http from "http";
import SocketIO from "socket.io"
// import WebSocket from "ws";
import express from "express";
// import { Socket } from "dgram";

const app = express();

app.set('view engine', "pug");
app.set('views', __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anonymous";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        // console.log(roomName);
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) =>
            socket.to(room).emit("bye", socket.nickname)
        );
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", nickname => socket["nickname"] = nickname);
});
// const wss = new WebSocket.Server({ server });

// function handleConnection(socket) {
//     console.log(socket)
// }

// const sockets = [];
// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     // console.log(socket)
//     console.log("Connected to Browser!");
//     socket.on("close", () => {
//         console.log("Disconnected from Browser!")
//     });
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg.toString("utf8"));
//         switch(message.type) {
//             case "message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
//             case "nickname":   
//                 socket["nickname"] = message.payload;
//         }
//     });
// });

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);