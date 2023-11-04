const express = require('express')
const { Server } = require('socket.io')
const { createServer } = require('http')
const path = require('path')


const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.json())
app.use(express.static(path.join(__dirname, 'client')))


const privateNamespace = io.of('/private')
let usersList = []
let usersSockets = {}


io.on('connect', (socket)=>{
    console.log(`Conexão estabelicda`)
    const { user } = socket.handshake.auth
    
    usersList.push(user)
    usersSockets[user] = socket
    
   
    socket.on('disconnect', ()=>{
        const searchUser = usersList.indexOf(user)
        if(searchUser !== -1){
            usersList.splice(searchUser, 1)
        }
    })
    
    socket.on('login', (username)=>{
        if(username !== user){
            socket.emit('login', 'ok')
        }else{
            socket.emit('login','Usuário já existe!')
        }
    })

    let realList = [...new Set(usersList)]
    console.log('Usuários online: ', usersList)
    realList.map(user=>{
        socket.emit('users', user)
    })

    
    socket.on('messages', (msg)=>{
        io.emit('messages', msg)
    })

    socket.on('privateRequest', (recipientName)=>{
        recipientSocket = usersSockets[recipientName]
        if(recipientSocket){
            recipientSocket.emit('privateMessage', user)   
        }        
    })

    socket.on('privateMessage', (recipientResponse)=>{
        recipientSocket = usersSockets[recipientResponse]
        if(recipientSocket){
            recipientSocket.emit('private', 'venha pai')
        }
    })   
    
})


privateNamespace.on('connect', (socket)=>{
    console.log('Conexão estabelecida no privado')

    socket.on('private', (msg)=>{
        privateNamespace.emit('private', msg)
    })
})


server.listen(3003, ()=>{
    console.log('Server actived')
})