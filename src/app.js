const parser = require('./chat-parser');
const express = require("express");
const loki = require('lokijs');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const PointsAggregator = require('../src/points-aggregator');
const db = new loki('users.db', {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 4000
});

function databaseInitialize() {
    let users = db.getCollection("users");
    if (users === null) {
        users = db.addCollection("users");
    }
    // kick off any program logic or start listening to external events
    start(users);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '100mb',
    extended: true
}));

function start(usersCollection) {
    const points = new PointsAggregator(usersCollection);
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get("/", (req, res) => res.send(points.getAllPoints()));

    app.get("/html", (req, res) => {
        let usersPoints = points.getAllPoints();
        if (req.query.limit) {
            usersPoints = usersPoints.slice(0, req.query.limit);
        }
        const userRows = usersPoints.map(user => {
            return `<tr>
          <td class="user-nick">${user.nick}</td>
          <td class="user-points">${user.points}</td>
          </tr>`;
        }).join(' ');
        res.send(`<html><body>
        <div class="content">
        <table>${userRows}</table>
        </div>
        </body>
        </html>`);
    });

    app.post("/", (req, res) => {
        const messages = req.body.value;
        const nicks = [];
        messages.forEach(message => {
            const user = parser.parseData(message);
            if (user.nick && nicks.indexOf(user.nick) === -1) {
                nicks.push(user.nick);
            }
        });
        console.log(`adding points to ${nicks.length} users`);
        nicks.forEach(nick => {
            points.addPoints(nick, 1);
        });

        res.send('ok');
    });
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

