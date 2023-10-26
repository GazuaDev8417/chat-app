import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { Payload, TokenData } from '../types/types'

config()


export class Authentication{
    token = (payload:Payload):string=>{
        return jwt.sign(
            { payload },
            process.env.JWT_KEY as string
        )
    }

    tokenData = (token:string):TokenData=>{
        return jwt.verify(
            token,
            process.env.JWT_KEY as string
        ) as TokenData
    }
}