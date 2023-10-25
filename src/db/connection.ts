import knex from 'knex'
import { config } from 'dotenv'


config()

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


export const con = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_SCHEMA 
    }
})

con.raw('SELECT 1+1 AS result').then(()=>{
    console.log('Conectado ao banco')
}).catch(e=>{
    console.log(`Falha ao conectar ao banco: ${e}`)
})


