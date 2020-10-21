var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var hbs = require('hbs');
//var upload_image = require('./image_upload.js');

var connection = mysql.createConnection({ //todo: write user controller and remove
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodecmc'
});

var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


///////////////////////////////////////////
const db = require("./models");
db.sequelize.sync();

const pages = require("./controllers/page.controller.js");
///////////////////////////////////////////

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/routes/index.html'));
});

app.get('/login', function (request, response) {
    response.sendFile(path.join(__dirname + '/routes/login.html'));
});

app.get('/admin/pages/sync/:id', pages.sync);

app.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/admin');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.get('/admin', pages.findAll);
app.get('/admin/pages/create', pages.create);
app.post('/admin/pages/create', pages.create);

app.get('/logout', function (request, response) {
    if (request.session.loggedin) {
        request.session.loggedin = false;
        request.session.username = null;
        response.redirect('/');

    }
});

// post image handler.
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