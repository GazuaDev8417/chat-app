export interface Message{
    id:string
    sender:string
    message:string
    description:string
    filename:string
}

export interface Payload{
    username:string
    privateChat:string
}

export interface TokenData{
    payload:string
    iat:number
}