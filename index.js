const express = require("express");
const app = express();
const enableWs = require("express-ws");
enableWs(app);

const callbacks = new Map();
app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/test.js", (req, res) => {
    res.send(`//# sourceMappingURL=./test.js.map?id=${req.query.id}`)
})

app.get("/test.js.map", (req, res) => {
    const callback = callbacks.get(req.query.id);
    if(callback) callback();
    res.send("ok")
});

app.ws("/", ws => {
    const id = Date.now().toString(36) + Math.random().toString(36);
    ws.send(id);

    callbacks.set(id, () => {
        callbacks.delete(id);
        ws.send("[ok]");
        ws.close();
    })

    ws.on("close", () => {
        callbacks.delete(id)
    })
})

app.listen(process.env.PORT || 5500, () => {
    console.log("up on http://localhost:5500")
})