import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { url } from '../../contstants/url'
import { Container } from "./styled"


export default function Signin(){
    const navigate = useNavigate()
    const formRef = useRef(null)
    const btn = useRef(null)
    const [form, setForm] = useState({
        nickname:''
    })


    useEffect(()=>{
        const user = localStorage.getItem('user')

        if(user){
            navigate('/chat')
        }

        formRef.current.style.marginTop = '10vh'
        formRef.current.style.transition = '2s'
    }, [])



    const onChange = (e)=>{
        const { name, value } = e.target
        setForm({...form, [name]: value})
    }


    const changeToGreen = ()=>{
        btn.current.style.background = 'green'
    }

    const backToDefault = ()=>{
        btn.current.style.background = 'rgb(50, 49, 49)'
    }


    const signin = (e)=>{
        e.preventDefault()

        const body = {
            nickname: form.nickname
        }
        
        axios.post(`${url}/signup`, body).then(res=>{
            localStorage.setItem('user', res.data)
            navigate('/chat')
        }).catch(e=>{
            alert(e.response.data)
        })

    }


    return(
        <Container>
            <form ref={formRef} onSubmit={signin}>
                <fieldset>
                    <legend>Login</legend>
                    <label htmlFor="nickname">Nome: </label>
                    <input type="text" name="nickname" onChange={onChange}
                        value={form.nickname} placeholder="Nome de usuário" required/>
                    <button ref={btn} 
                        onMouseOver={changeToGreen}
                        onMouseOut={backToDefault} 
                        type="submit">Entrar</button>
                </fieldset>
            </form>
        </Container>
    )
}