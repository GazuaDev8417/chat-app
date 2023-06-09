import styled from "styled-components"



export const Container = styled.div`
    margin: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    background-image: url('https://media.istockphoto.com/id/1218737747/vector/learning-online-e-learning-video-call-chat-with-class-distance-education.jpg?s=612x612&w=0&k=20&c=fFFwc3CTP4XtvmruZLiK8EzAbzvAxJL_kw5BsA7z7w8=');
    background-size: cover;

    form{
        margin-top: -20vh;
        font-size: 15pt;
    }


    fieldset{
        display: flex;
        align-items: center;
        gap: 10px;
        width: 30vw;
        line-height: 7vh;
        padding: 20px;
        box-shadow: 3px 3px 6px;
        border-radius: 10px;

        @media(max-width: 320px){
            justify-content: center;
            width: 80vw;
        }

        @media(max-width: 600px){
            width: 60vw;
        }
    }

    legend{
        font-size: 1.5em;
        text-align: center;
    }

    label{
        @media(max-width: 600px){
            display: none;
        }
    }

    input{
        width: 50%;
        height: 30px;
        font-size: 13pt;
        padding-left: 10px;
        border-radius: 10px;
        outline: none;
    }

    button{
        width: 30%;
        height: 35px;
        border-radius: 10px;
        cursor: pointer;
        background-color: rgb(50, 49, 49);
        color: white;
        font-size: 13pt;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 2px 2px 4px gray;
        border: none;
    }

    button:active{
        transform: scale(0.9);
    }
`