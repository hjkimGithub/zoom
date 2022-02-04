import http from "http";
import WebSocket from "ws";
import express from "express";
import { Socket } from "dgram";

const app = express()

app.set('view engine', "pug");
app.set('views', __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// function handleConnection(socket) {
//     console.log(socket)
// }

const sockets = [];


wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    // console.log(socket)
    console.log("Connected to Browser!");
    socket.on("close", () => {
        console.log("Disconnected from Browser!")
    });
    socket.on("message", (msg) => {
        const message = JSON.parse(msg.toString("utf8"));
        switch(message.type) {
            case "message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
            case "nickname":   
                socket["nickname"] = message.payload;
        }
    });
});

server.listen(3000, handleListen);