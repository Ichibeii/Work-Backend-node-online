const fs = require("fs");
const HandleDBMSMySQL = require("../config/database/HandleDBMSMYSQL");
const { error } = require("console");

class ModelAcess {
    constructor() {
        this.HandleDBMSMySQL = new HandleDBMSMySQL();
        this.envFile = JSON.parse(fs.readFileSync("./config/server/env.json", "utf-8"));
    }

    destroy(param = null) {
        const varToString = varObj => Object.keys(varObj)[0];
        console.error(
            `Parâmetros incorretos para a classe: ${this.constructor.name}, parâmetro ${varToString({ param })}`
        );
    }

    postAcess(timestamp = null, hostname = null, ip = null) {
        this.timestamp = (typeof timestamp !== "string" || timestamp === null)
            ? this.destroy(timestamp)
            : timestamp;
        this._hostname = (typeof hostname !== "string" || hostname === null)
            ? this.destroy(hostname)
            : hostname;
        this.ip = (typeof ip !== "string" || ip === null)
            ? this.destroy(ip)
            : ip;

        const table = "acess";
        const sqlInsert = `INSERT INTO ${this.envFile.database}.${table} VALUES (null, '${this.timestamp}', '${this._hostname}', '${this.ip}')`;

        this.HandleDBMSMySQL.query(sqlInsert);
        this.HandleDBMSMySQL.close();
    }
}

module.exports = ModelAcess;
