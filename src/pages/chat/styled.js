import styled from 'styled-components'


export const Container = styled.div`
    margin: 0;
    background-image: linear-gradient(rgba(211, 211, 211, 0.8), rgba(128, 128, 128, 0.7));
    display: grid;
    height: 100vh;
    width: 100vw;
    grid-template-areas:
    "users header"
    "users main";
    grid-template-columns: 25vw 1fr;
    grid-template-rows: 7vh 1fr;

    header{
        grid-area: header;
        border-bottom: 1px solid;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 15px;
    }

    header h1{
        @media(max-width: 600px){
            font-size: 1.2em;
            padding: 0;
        }
    }

    .logout{
        font-size: 12pt;
        cursor: pointer;
        box-shadow: 3px 3px 6px green;
        border-radius: 50%;
        padding: 5px;

        @media(max-width: 800px){
            left: 19vw;
            padding: 5px;
        }

        @media(max-width: 600px){
            left: 90vw;
            top: 10vh;
            font-size: 10pt;
            padding: 5px;
        }
    }

    .logout:hover{
        background-color: green;
        color: white;
    }

    .logout:active{
        transform: scale(0.8);
    }


    aside{
        grid-area: users;
        border-right: 1px solid;
        display: grid;
        grid-template-areas:
        "userHeader"
        "usersList";
        grid-template-rows: 15vh 1fr;
    }

    aside .userHeader{
        grid-area: userHeader;
        border-bottom: 1px solid;
        border-bottom-left-radius: 10px;
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 20px 10px 20px;

        @media(max-width: 600px){
            padding: 10px 5px 10px;
            border-bottom-left-radius: 0;        
        }
    }

    aside .userHeader .icon{
        box-shadow: 3px 3px 6px green;
        border-radius: 50%;
        padding: 10px;
        font-size: 2em;
        cursor: pointer;

        @media(max-width: 600px){
            font-size: 12pt;
        }

        @media(max-width: 800px){
            font-size: 10pt;
        }
    }


    aside .userHeader .icon:hover{
        background-color: green;
        color: white;
    }

    aside .userHeader .icon:active{
        transform: scale(0.8);
    }

    aside .userHeader #imgProfile{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 3px 3px 6px;

        @media(max-width: 800px){
            width: 40px;
            height: 40px;
        }
    }

    aside .userHeader #imgProfile:active{
        transform: scale(0.8);
    }

    aside .userHeader #userName{
        font-family: 'Ysabeau', sans-serif;
        font-size: 2rem;
        font-weight: bold;

        @media(max-width: 800px){
            font-size: 1.5rem;
        }
    }

    aside .user-list{
        grid-area: usersList;
        overflow: auto;
        padding-left: 10px;
        margin-top: 5vh;

        @media(max-width: 600px){
            display: flex;
            gap: 10px;
        }
    }

    aside .user-list .icon{
        background-color: yellowgreen;
        padding: 10px;
        border-radius: 50%;
    }

    aside .user-list .icon:hover{
        background-color: green;
        box-shadow: 3px 3px 6px green;
        color: white;
    }

    aside .user-list .icon:active{
        transform: scale(0.8);
    }

    aside .user-list .user{
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 5px;
        cursor: pointer;
    }


    main{
        grid-area: main;
        overflow: auto;
        display: grid;
        grid-template-areas: 
        "messages"
        "input";
        grid-template-rows: 1fr 7vh;
        
        @media(max-width: 600px){
            height: 100vh;
        }
    }

    .messages{
        grid-area: messages;
        overflow-y: auto;
        background-image: url('https://wallpapercave.com/wp/wp4410716.jpg');
    }

    .modal{    
        position: absolute;
        background-color: lightgray;
        width: 75vw;
        height: 93vh;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .modal #close{
        position: absolute;
        top: 1%;
        left: 1%;
        font-size: 20pt;
        cursor: pointer;
    }

    .modal #attachImage{
        width: 300px;
        height: 300px;
    }

    .modal .inputContainer{
        width: 45.5vw;
        margin-top: 10vh;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .modal #imageDescription{
        width: 40vw;
        height: 30px;
        border-radius: 15px;
        border: none;
        box-shadow: 2px 2px 4px;
        outline: none;
        padding-left: 20px;
    }

    .modal .inputContainer button{
        border-radius: 100%;
        border: none;
        outline: none;
        padding: 7px;
        cursor: pointer;
    }

    .modal .inputContainer #sendMessage{
        color: green;
        font-size: 18pt;
    }


    .messageContainer{
        display: flex;
        justify-content: flex-end;    
    }

    .message{
        margin: 15px 30px;
        width: 25%;
        padding: 0 10px;
        border: 1px solid;
        border-radius: 10px;
        box-shadow: 3px 3px 6px;

        @media(max-width: 800px){
            width: 30vw;
        }
        @media(max-width: 600px){
            width: 60vw;
        }
    }

    .left{
        justify-content: flex-start;

        @media(max-width: 600px){
            margin-left: -5vw;
        }
    }

    .right{
        position: relative;
        left: 20vw;
    }

    .messageInfo{
        display: flex;
        justify-content: space-between;
        margin-bottom: -15px;
    }

    .fileContainer{
        text-align: center;
    }

    .fileContent{
        width: 150px;
        height: 200px;
    }


    .bottomNavigation{
        grid-area: input;
        display: flex;
        align-items: center;  
        justify-content: space-around;
        margin: 0 10px;
    }

    .bottomNavigation #attach{
        color: rgb(38, 37, 37);
        font-size: 15pt;
        cursor: pointer;
    }

    .bottomNavigation input[type='text']{
        width: 90%;
        height: 30px;
        border-radius: 10px;
        border: none;
        outline: none;
        box-shadow: 2px 2px 4px;
        padding-left: 15px;

        @media(max-width: 600px){
            width: 84vw;
        }
    }

    .bottomNavigation #msgTemp{
        color: gray;
        font-size: 18pt;
    }

    .bottomNavigation button:active{
        transform: scale(0.8);
    }

    /* .bottomNavigation #sendMessage{
        font-size: 18pt;
        color: rgb(38, 37, 37);
    } */
`