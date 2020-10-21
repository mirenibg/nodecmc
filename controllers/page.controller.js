const db = require("../models");
const Page = db.pages;
const Op = db.Sequelize.Op;
var path = require('path');
const generator = require('../components/StaticPageGenerator');
const fs = require('fs');
const AWS = require('aws-sdk');

exports.create = (req, res) => {
    if (!req.session.loggedin) {
        res.status(403).send({
            message: "Please login!"
        });
        return;
    }

    if (req.method == "GET") {
        res.sendFile(path.join(__dirname + '/../routes/create-page.html'));
        return;
    }

    if (!req.body.title) {
        res.status(400).send({
            message: "Title can not be empty!"
        });
        return;
    }

    const page = {
        title: req.body.title,
        body: req.body.body,
    };

    Page.create(page)
        .then(data => {
            res.redirect('/admin');
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the page."
            });
        });
};

exports.findAll = (req, res) => {
    if (!req.session.loggedin) {
        res.status(403).send({
            message: "Please login!"
        });
        return;
    }
    Page.findAll()
        .then(data => {
            res.render('pages', {
                results: data
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving pages."
            });
        });
};

exports.sync = (req, res) => {
    Page.findOne({ id: req.params.id }).then(page => {
        const fileName = page.title + '.html';

        fileContent = generator.generatePage(page);
        console.log(fileContent);

        // Setting up S3 upload parameters
        const params = {
            Bucket: 'statickotbucket',
            Key: fileName,
            Body: fileContent
        };
        const s3 = new AWS.S3({
            accessKeyId: 'AKIAJLBIFUCEYJTSPT6A',
            secretAccessKey: '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'
        });

        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
        });

    });
};

exports.findOne = (req, res) => {
    Page.findOne(req.body.id)
        .then(data => {
            res.send(data)
                .catch(err => {
                    console.log(err);
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving pages."
                    });
                });
        })
};


exports.update = (req, res) => {

};

exports.delete = (req, res) => {

};

exports.deleteAll = (req, res) => {

};

exports.findAllSynced = (req, res) => {

};