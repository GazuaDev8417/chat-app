import express from 'express'
import logger from 'morgan'
import path from 'path'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { con } from './db/connection'
import { Message } from './types/types'



const app = express()
const server = createServer(app)
const io = new Server(server)
const port = process.env.port ?? 3003



io.on('connect', async(socket):Promise<void>=>{
    const { username } = socket.handshake.auth

    socket.on('disconnect', ()=>{
        console.log('Usuário descontectado')
    })

    socket.on('logout', async(username)=>{
        await con('chat_messages').delete().where({ sender: username })
    })

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
    /* const [messages]:any = await con.promise().query(`
        SELECT * FROM chat_messages ORDER BY moment ASC
    `) */

    messages.map((message:Message)=>{
        socket.emit('message', message.message, message.sender)
    })
})

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, '../client')))

server.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`)
})

