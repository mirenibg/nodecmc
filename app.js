var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/**
 * db and controllers
 */
const db = require("./models");
db.sequelize.sync();

const pages = require("./controllers/page.controller.js");
const users = require("./controllers/user.controller.js");

/**
 * routes
 */
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/routes/index.html'));
});

app.get('/login', function (request, response) {
    response.sendFile(path.join(__dirname + '/routes/login.html'));
});

app.post('/auth', users.auth);
app.get('/logout', users.logout);

app.get('/admin', pages.findAll);
app.get('/admin/pages/create', pages.create);
app.post('/admin/pages/create', pages.create);
app.get('/admin/pages/sync/:id', pages.sync);


// TODO: post image handler.
app.post('/image_upload', function (req, res) {

    upload_image(req, function (err, data) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        res.send(data);
    });
});

// Create folder for uploading files.
var filesDir = path.join(path.dirname(require.main.filename), 'uploads');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}


app.listen(3000, () => {
    console.log('Listening on port ' + 3000);
});