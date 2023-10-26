import express from 'express'
import logger from 'morgan'
import path from 'path'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { con } from './db/connection'
import { Message } from './types/types'
import { Authentication } from './services/Authentication'


const app = express()
const server = createServer(app)
const io = new Server(server)
const port = process.env.port ?? 3003



io.on('connect', async(socket):Promise<void>=>{
    const { username, privateChat } = socket.handshake.auth
    console.log({username, privateChat})
    const token = new Authentication().token({username, privateChat})

    
    socket.on('connect', ()=>{
        console.log('Usuário conectado')
    })

    socket.on('login', async(username)=>{
        try{
            const user = await con('chat_messages').where({
                sender: username
            })
    
            if(user.length > 0){
                throw new Error('Usuário já existe!')
            }

            socket.emit('login', 'ok')
        }catch(e:any){
            socket.emit('login', e.message)
        }
    })

    socket.on('logout', async(username)=>{
        await con('chat_messages').delete().where({ sender: username })
    })

/* COMUNICATION AMONG USERS */
    socket.on('message', async(msg)=>{
        try{
            const id = Math.random().toString(16)
            await con('chat_messages').insert({
                id,
                sender: username,
                message: msg,
                description: 'Vai veno',
                filename: 'Vai veno',
                moment: Date.now()
            })

            io.emit('message', msg)
        }catch(e){
            console.log(`Erro inserir mensagem no banco: ${e}`)
            return
        }
    })

    const messages = await con('chat_messages')
        .select('*').orderBy('moment', 'asc')

    messages.map((message:Message)=>{
        socket.emit('message', message.message, message.sender)
    })

/* PRIVATE COMUNICATION */
    socket.emit('private', token)
    socket.on(token, (msg)=>{
        console.log(msg)
    })
})

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, '../client')))

server.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`)
})

