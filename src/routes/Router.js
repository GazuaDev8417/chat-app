import { Routes, Route } from "react-router-dom"
import Signin from '../pages/signin'
import Chat from "../pages/chat"



export default function Router(){
    return(
        <Routes>
            <Route exact path="/" element={<Signin/>}/>
            <Route exact path="/chat" element={<Chat/>}/>
        </Routes>
    )
}
