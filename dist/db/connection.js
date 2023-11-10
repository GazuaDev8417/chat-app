"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.con = void 0;
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
/*
export const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA
})

con.connect(e=>{
    if(e){
        return console.log(`Erro ao conectar banco de dados: ${e}`)
    }

    console.log('Conectado ao banco')
}) */
exports.con = (0, knex_1.default)({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_SCHEMA
    }
});
exports.con.raw('SELECT 1+1 AS result').then(() => {
    console.log('Conectado ao banco');
}).catch(e => {
    console.log(`Falha ao conectar ao banco: ${e}`);
});
