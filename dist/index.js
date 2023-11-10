"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const connection_1 = require("./db/connection");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const port = process.env.port ?? 3003;
app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
server.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`);
});
//NAMESPACES
const chatNamespace = io.of('/chat');
const notificationNamespace = io.of('/notifications');
const privateNamespace = io.of('/private');
//TO SOTORED OLINE USERS
const onlineUsers = {};
/* ----------------------------------- */
chatNamespace.on('connect', async (socket) => {
    console.log('Usuário conectado');
    const { username } = socket.handshake.auth;
    onlineUsers[username] = socket;
    /* socket.on('disconnect', async()=>{
        try{
            await con('chat_messages').delete().where({ sender: username })
            await con('chat_users').delete().where({ user: username })
        }catch(e){
            console.log(e)
        }
    }) */
    socket.on('login', async (nickname) => {
        try {
            const [user] = await (0, connection_1.con)('chat_users').where({
                user: nickname
            });
            if (user) {
                throw new Error('Usuário já existe!');
            }
            await (0, connection_1.con)('chat_users').insert({
                id: `${Date.now()}-${Math.random().toString(16)}`,
                user: nickname
            });
            socket.emit('login', 'ok');
        }
        catch (e) {
            socket.emit('login', e.message);
        }
    });
    socket.on('logout', async (nickname) => {
        try {
            await (0, connection_1.con)('chat_messages').delete().where({ sender: nickname });
            await (0, connection_1.con)('chat_users').delete().where({ user: nickname });
        }
        catch (e) {
            console.log(e);
        }
    });
    /* LIST OF ALL USERS */
    const users = username && await (0, connection_1.con)('chat_users');
    socket.emit('users', users);
    /* COMUNICATION AMONG USERS */
    socket.on('message', async (msg, user) => {
        try {
            const id = Math.random().toString(16);
            await (0, connection_1.con)('chat_messages').insert({
                id,
                sender: username,
                message: msg,
                description: 'Vai veno',
                filename: 'Vai veno',
                moment: Date.now()
            });
            chatNamespace.emit('message', msg, user);
        }
        catch (e) {
            console.log(`Erro inserir mensagem no banco: ${e}`);
        }
    });
    const messages = await (0, connection_1.con)('chat_messages')
        .select('*').orderBy('moment', 'asc');
    messages.map((message) => {
        socket.emit('message', message.message, message.sender, message.id);
    });
    /* SHIPPING REQUEST FOR PRIVATE CHAT */
    socket.on('privateRequest', (recipient) => {
        const recipientSocket = onlineUsers[recipient];
        if (recipientSocket) {
            recipientSocket.emit('privateMessage', username);
        }
        else {
            socket.emit('isolated', `${recipient} não está na sala.`);
        }
    });
    socket.on('privateMessage', (recipient, msg) => {
        const recipientSocket = onlineUsers[recipient];
        if (recipientSocket) {
            if (msg === 'Aceitou') {
                recipientSocket.emit('private', 'Aceitou', username);
            }
            else if (msg === 'Recusou') {
                recipientSocket.emit('private', 'Recusou', username);
            }
        }
    });
});
privateNamespace.on('connect', (socket) => {
    console.log('Conexão privada');
    socket.on('private', (msg, username) => {
        privateNamespace.emit('private', msg, username);
    });
});
