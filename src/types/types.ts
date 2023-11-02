export interface Message{
    id:string
    sender:string
    message:string
    description:string
    filename:string
}

export interface User{
    id:string
    user:string
}

export interface Payload{
    username:string
    user:string
}

export interface TokenData{
    payload:string
    iat:number
}