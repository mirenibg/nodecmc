var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var upload_image = require('./image_upload.js');

var connection = mysql.createConnection({
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/routes/index.html'));
});

app.get('/login', function (request, response) {
    response.sendFile(path.join(__dirname + '/routes/login.html'));
});

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

app.get('/admin', function (request, response) {
    if (request.session.loggedin) {
        // response.redirect('/admin');
        response.sendFile(path.join(__dirname + '/routes/admin.html'));

    } else {
        response.send('Please login to view this page!');
        response.end();
    }
});

app.get('/admin/pages/create', function (request, response) {
    if (request.session.loggedin) {
        // response.redirect('/admin');
        response.sendFile(path.join(__dirname + '/routes/create-page.html'));

    } else {
        response.send('Please login to view this page!');
        response.end();
    }
});

app.post('/admin/pages/create', function (request, response) {
    if (request.session.loggedin) {
        var title = request.body.title;
        var body = request.body.body;

        console.log(title);
        console.log(body);

    } else {
        response.send('Please login to view this page!');
        response.end();
    }
});

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