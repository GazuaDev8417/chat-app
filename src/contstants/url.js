import io from 'socket.io-client'
// export const url = 'https://chat-phi-woad.vercel.app'
export const url = 'http://localhost:3003'
export const socket = io(url)