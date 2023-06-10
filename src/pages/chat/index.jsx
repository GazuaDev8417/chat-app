import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import axios from 'axios'
import { url } from '../../contstants/url'
import { AiOutlineLogout } from 'react-icons/ai'
import { BsFillPersonFill } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { IoSendSharp } from 'react-icons/io5'
import { ImAttachment } from 'react-icons/im'
import { Container } from './styled'
import './chat.css'


const socket = io(url)


export default function Chat(){
    const navigate = useNavigate()
    const inputFile = useRef(null)
    const inputAttach = useRef(null)
    const modalRef = useRef(null)
    const attachImage = useRef(null)
    const containerRef = useRef(null)
    const btnRef = useRef(null)
    const user = localStorage.getItem('user')
    const [profileImg, setProfileImg] = useState(null)
    const [attach, setAttach] = useState(null)
    const [attachName, setAttachName] = useState('')
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ input:'', description:'' })



      
    useEffect(()=>{
        if(!user){
            navigate('/')
        }
        
        getMessages()
        getUsers()
    }, [])


    const getMessages = ()=>{
        axios.get(`${url}/messages`).then(res=>{
            setMessages(res.data)
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const handleProfileImg = (e)=>{
        const file = e.target.files[0]
        setProfileImg(URL.createObjectURL(file))
    }

    const handleAttachment = (e)=>{
        const file = e.target.files[0]
        setAttachName(file.name)
        setAttach(URL.createObjectURL(file))
        
        setShowModal(true)
        form.input = ''
    }
    
    useEffect(()=>{
        if(attachImage.current){
            attachImage.current.src = attach
        }
    }, [attach])

    
    const onChange = (e)=>{
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }
    

    const getUsers = ()=>{
        axios.get(`${url}/users`).then(res=>{
            setUsers(res.data)
        }).catch(e=>{
            alert(e.response.data)
        })
    }

    
    const sendMessage = (e)=>{
        e.preventDefault()

        const body = {
            sender: user,
            message: form.input,
            description: form.description,
            filename: attachName
        }

        socket.emit('message', {
            sender: user,
            message: form.input,
            description: form.description,
            file: attach
        })

        axios.post(`${url}/messages`, body).then(()=>{
            
        }).catch(e=>{
            alert(e.response.data)
        })

        setForm({ input:'' })
        setShowModal(false)
        containerRef.current.scrollTop = containerRef.current.scrollHeight
    }

    useEffect(()=>{
        socket.on('receivedMessage', response=>{
            setMessages(prevMessages => [...prevMessages, response])
        })

        return () => {
            socket.off('receivedMessage')
          }

    }, [])
    

    const logout = ()=>{
        const decide = window.confirm('Tem certeza que deseja deslogar?')

        if(decide){
            axios.delete(`${url}/signout/${user}`).then(()=>{
                localStorage.clear()
                navigate('/')
            }).catch(e=>{
                alert(e.response.data)
            })
        }
    }



    return(
        <Container>
            <header>
                <div/>
                <h1>Chat</h1>
                <AiOutlineLogout onClick={logout} className='logout'/>
            </header>
            <aside className="users">
                <div className="userHeader">
                    <input type="file" style={{display:'none'}}
                        ref={inputFile}
                        accept='image/*' 
                        onChange={handleProfileImg} />
                    {profileImg ? (
                        <img src={profileImg}
                            onClick={()=> inputFile.current.click()} 
                            alt="Profile" id="imgProfile"/>
                    ) : <BsFillPersonFill
                            onClick={()=> inputFile.current.click()}
                            className='icon'/>}                    
                    <span id="userName">{user}</span>
                </div>
                <div className="user-list">
                    {users.length > 0 ? (
                        users.map(user=>{
                            return(
                                <div className="user" key={user.id}>
                                    <BsFillPersonFill className='icon'/>
                                    {user.nickname}
                                </div>
                            )
                        })
                    ) : null}
                </div>
            </aside>
            <main>
                {showModal ? (
                    <div className="modal" ref={modalRef}>
                        <IoMdClose
                            onClick={()=> setShowModal(false)} 
                            id='close'/>
                        <img ref={attachImage} alt="attachImage" id="attachImage"/>
                        <div className="inputContainer">
                            <input
                                form='form'  
                                type="text"
                                name='description'
                                value={form.description}
                                onChange={onChange} 
                                id="imageDescription"
                                autoFocus
                                placeholder='Mensagem'/>
                            <button
                                form='form'
                                ref={btnRef}
                                style={{display:'none'}} 
                                type="submit"></button>
                            <IoSendSharp
                                onClick={()=> btnRef.current.click()} 
                                id='sendMessage'/>
                        </div>
                    </div>
                ) : null}
                <div className="messages" ref={containerRef}>
                    {messages && messages.map(message =>(
                        <div className={
                            `messageContainer ${message.sender === user ? '' : 'left'}`
                        } key={message.id}>
                            <div style={{
                                background: message.sender === user ? 
                                'linear-gradient(lightgray, whitesmoke)' : 'linear-gradient(whitesmoke, gray)'
                            }} 
                                className="message">
                                <div className="messageInfo">
                                    <p className="username">{message.sender}</p>
                                    <p className="date">
                                        <small>
                                            {new Date().toLocaleTimeString()}
                                        </small>
                                    </p>
                                </div>
                                {message.message ? (
                                    <p>{message.message}</p>
                                ) : (
                                    <div className="fileContainer">
                                        <p>
                                            <img src={message.file}
                                                alt="Imagem de axexo" 
                                                className="fileContent" /><br/>
                                            {message.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div> 
                    ))}
                </div>
                <form id='form' 
                    onSubmit={sendMessage}
                    className="bottomNavigation">
                    <input ref={inputAttach} accept='image/*' 
                        onChange={handleAttachment}
                        type="file" id="inputAttach"
                        style={{display:'none'}}/>
                    <ImAttachment
                        onClick={()=> inputAttach.current.click()} 
                        id='attach'/>
                    <input type="text" name="input" value={form.input}
                        onChange={onChange}
                        id="input" autoFocus
                        placeholder='Mensagem'/>
                    <IoSendSharp
                        onClick={form.input ? sendMessage : null}
                        style={{fontSize:'18pt', cursor:'pointer'}}
                        color={form.input ? 'green' : 'rgb(38, 37, 37)'} 
                        id='sendMessage'/>
                </form>
            </main>
        </Container>
    )
}