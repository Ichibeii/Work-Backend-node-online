const { rejects } = require('assert');
const fs = require('fs');
const mysql = require("mysql");
const { resolve } = require('path');
const { response } = require('../../webservice/app');

class HandleDBMSMySQL {

    constructor(host = null, database = null, user = null, password = null) {
        var envFile = JSON.parse(fs.readFileSync("./config/server/env.json", "utf8"));
        if (envFile) {
            this.host = (typeof host != "string" || host === null) ?
                envFile.host : host;
            this.database = (typeof database !== "string" || database === null) ?
                envFile.database : database;
            this.user = (typeof user !== "string" || user === null) ?
                envFile.user : user;
            this.password = (typeof password !== "string" || password === null) ?
                envFile.password : password;

            this.connect();
        }
    }

    connect() {
        this.connection = mysql.createConnection({
            host: this.host,
            database: this.database,
            user: this.user,
            password: this.password
        });
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    var resultsJson = { "metadata": {}, "data": {} };
                    resultsJson.metadata = fields.map((r) => Object.assign({}, r));
                    resultsJson.data = results.map((r) => Object.assign({}, r));
                    resolve(resultsJson);
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}
