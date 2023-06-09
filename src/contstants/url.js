import io from 'socket.io-client'
export const url = 'https://chat-jcnn.onrender.com'
// export const url = 'http://localhost:3003'
export const socket = io(url)