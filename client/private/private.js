import { io } from 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.esm.min.js'
    

const username = localStorage.getItem('username')
const privateChat = localStorage.getItem('privateChat')

const socket = io('/private',{
    auth: { username }
})
const form = document.querySelector('#form')
const input = document.querySelector('#input')
const messages = document.querySelector('#messages') 
const logout = document.querySelector('#logout')
const exitPrivate = document.querySelector('#exitPrivate')


logout.onclick = ()=>{
    const decide = window.confirm('Tem certeza que deseja sair do chat?')

    if(decide){
        localStorage.clear()
        socket.emit('logout', username)
        location.href = '../index.html'
    }
}

exitPrivate.onclick = ()=>{
    location.href = '../chat/chat.html'

    socket.emit('private', `${username} saiu do privado`, username)
}

socket.on('private', (msg, sender)=>{       
    const item = `
        <li>
            <small>${sender}</small><br>
            ${msg}
        </li>`
    messages.insertAdjacentHTML('beforeend', item)
})

form.addEventListener('submit', (e)=>{
    e.preventDefault()

    socket.emit('private', input.value, username)
    input.value = ''
})