import express from 'express'
import path from 'path'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { con } from './db/connection'
import { Message, User } from './types/types'
import cors from 'cors'


const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'https://chat-client-hnrt.onrender.com',
        methods: ['GET,HEAD,PUT,PATCH,POST,DELETE']
    }
})
const port = process.env.port ?? 3003

app.use(express.static(path.join(__dirname, '../../client')))




server.listen(port, ()=>{
    console.log(`Servidor rodando na porta: ${port}`)
})


//NAMESPACES
const chatNamespace = io.of('/chat')
const notificationNamespace = io.of('/notifications')
const privateNamespace = io.of('/private')

//TO SOTORED OLINE USERS
const onlineUsers:{ [key:string]:any } = {}
/* ----------------------------------- */

chatNamespace.on('connect', async(socket):Promise<void>=>{
    console.log('Usuário conectado')
    const { username } = socket.handshake.auth

    onlineUsers[username] = socket

    /* socket.on('disconnect', async()=>{
        try{
            await con('chat_messages').delete().where({ sender: username })
            await con('chat_users').delete().where({ user: username })
        }catch(e){
            console.log(e)
        }
    }) */

    socket.on('login', async(nickname)=>{
        try{
            const [user] = await con('chat_users').where({
                user: nickname
            })
            
            if(user){
                throw new Error('Usuário já existe!')
            }

            await con('chat_users').insert({
                id: `${Date.now()}-${Math.random().toString(16)}`,
                user: nickname
            })

            socket.emit('login', 'ok')
        }catch(e:any){
            socket.emit('login', e.message)
        }
    })

    socket.on('logout', async(nickname)=>{
        try{
            await con('chat_messages').delete().where({ sender: nickname })
            await con('chat_users').delete().where({ user: nickname })
        }catch(e){
            console.log(e)
        }
    })

/* LIST OF ALL USERS */
    const users:User[] = username && await con('chat_users')
    socket.emit('users', users)
   

/* COMUNICATION AMONG USERS */
    socket.on('message', async(msg, user)=>{
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

            chatNamespace.emit('message', msg, user)
        }catch(e){
            console.log(`Erro inserir mensagem no banco: ${e}`)
        }
    })

    const messages:Message[] = await con('chat_messages')
        .select('*').orderBy('moment', 'asc')
        
    messages.map((message)=>{
        socket.emit('message', message.message, message.sender, message.id)
    })

/* SHIPPING REQUEST FOR PRIVATE CHAT */
    socket.on('privateRequest', (recipient)=>{
        const recipientSocket = onlineUsers[recipient]
        
        if(recipientSocket){
            recipientSocket.emit('privateMessage', username)
        }else{
            socket.emit('isolated', `${recipient} não está na sala.`)
        }
    })
    
    socket.on('privateMessage', (recipient, msg)=>{
        const recipientSocket = onlineUsers[recipient]

        if(recipientSocket){
            if(msg === 'Aceitou'){
                recipientSocket.emit('private', 'Aceitou', username)
            }else if(msg === 'Recusou'){
                recipientSocket.emit('private', 'Recusou', username)
            }
        }
    })
})


privateNamespace.on('connect', (socket)=>{
    console.log('Conexão privada')

    socket.on('private', (msg, username)=>{
        privateNamespace.emit('private', msg, username)
    })
})

