import express from 'express'
import path from 'path'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { con } from './db/connection'
import { Message, User } from './types/types'


const app = express()
const server = createServer(app)
const io = new Server(server)
const port = process.env.port ?? 3003
//NAMESPACES
const chatNamespace = io.of('/chat')
const notificationNamespace = io.of('/notifications')
const privateNamespace = io.of('/private')

//TO SOTORED OLINE USERS
const onlineUsers:{ [key:string]:any } = {}

chatNamespace.on('connect', async(socket):Promise<void>=>{
    const { username, privateChat } = socket.handshake.auth

    onlineUsers[username] = socket
    
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
        try{
            await con('chat_messages').delete().where({ sender: username })
            await con('chat_users').delete().where({ user: username })
        }catch(e){
            console.log(e)
        }
    })

/* LIST OF ALL USERS */
    /* const users:User[] = await con('chat_users')
    users.map(user=>{
        socket.emit('users', user.user)
    })
    socket.on('users', (msg)=>{
        console.log(msg)
    }) */
   

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
        }
    })

    const messages:Message[] = await con('chat_messages')
        .select('*').orderBy('moment', 'asc')
    messages.map((message)=>{
        socket.emit('message', message.message, message.sender)
    })
})

notificationNamespace.on('connect', (socket)=>{
    socket.on('privateCall', msg=>{
        console.log(msg)
    })
})


app.use(express.static(path.join(__dirname, '../client')))

server.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`)
})

