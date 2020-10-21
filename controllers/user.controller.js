const db = require("../models");
const User = db.users;
const bcrypt = require('bcrypt');

exports.auth = (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    if (username && password) {
        User.findOne({
            where: { username }
        }).then(user => {
            if (user && bcrypt.compare(password, user.password)) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/admin');
            } else {
                res.send('Incorrect Username and/or Password!');
            }
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
};

exports.logout = (req, res) => {
    if (req.session.loggedin) {
        req.session.loggedin = false;
        req.session.username = null;
        res.redirect('/');
    }
};