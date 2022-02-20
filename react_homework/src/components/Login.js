
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import Navlogo from './Logocomponent';

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    font-family: 'Lato', sans-serif;
    width: 100%;
`
const Formcomponent = styled.form`
    display: flex;
    flex-direction: column;
    width: 285px;
    padding: 10px 26px 39px 25px;
    background: white;
    text-align: center;
`
const Inputfield = styled.input`
    margin: 10px;
    height: 25px;
    border-radius: 6px;
    border: 1px solid #dadada;
    padding: 3px;
`
const Inputfieldsubmit = styled(Inputfield)`
    border: none;
    height: auto;
    background-color: #0cf;
    color: white;
    padding 15px;
    font-weight: 400;

`
const Labelcomponent = styled.label`
    fonst-size: 13px;
    margin-left: 10px;
    color: #5d5d5d;
    text-align: left;
    font-weight: 300;
`

const Loginpage = () => {
    const baseUrl = "https://dev.navigil.io"
    const [background, setBgImage] = useState('');
    const [formText, setFormText] = useState('')
    const [copyRight, setCopyRight] = useState('')
    const [navLink, setNavLink] = useState('')
    const { register, handleSubmit } = useForm();
    const onSubmit = ()=> handleLogin();

    //effect for setting random background image
    useEffect(() => {

        //This should be written under one request and then parse data from that e.g get setting names in states
        async function getImageUrl() {
            let url = 'https://apidev.navigil.io/base/get-loginpage-settings';
            try {
                let res = await fetch(url);
                return await res.json();
            } catch (error) {
                console.log(error);
            }
        }

        //sets the backgroundimage based on the data returned from getImageUrl function
        const setBackgroundUrl = async () => {
            await getImageUrl()
                .then(data => JSON.parse(data.body[0].filter(x => x.setting_name === "bg-image").pop().data))
                .then(imgArray => setBgImage(imgArray[Math.floor(Math.random() * imgArray.length)]));
        }
        setBackgroundUrl();

        //sets the header for login form
        const setTextStates = async () => {
            await getImageUrl()
                .then(data => data.body[0].filter(x => x.setting_name === "login-form-text").pop().data)
                .then(txt => setFormText(txt));
        }
        setTextStates();

        //sets the header for login form
        const setCopyR = async () => {
            await getImageUrl()
                .then(data => data.body[0].filter(x => x.setting_name === "copy-text").pop().data)
                .then(txt => setCopyRight(txt));
            await getImageUrl()
            .then(data => data.body[0].filter(x => x.setting_name === "copy-link").pop().data)
            .then(txt => setNavLink(txt));
        }
        setCopyR();
        //sets the header for login form
        

    }, [])

    //object for setting the backgorund image for the login page
    const divStyle = {
        backgroundImage: `url(${baseUrl}${background})`
    
    };

    const handleLogin = () => {
    //Signin Ok
      localStorage.setItem("isAuthenticated", "true");
      window.location.pathname = "/";
    }

    return (
        
        <Wrapper className='wrapper' style={divStyle}>
            <Navlogo />
            <Formcomponent onSubmit={handleSubmit(onSubmit)}>
                <h2>{formText}</h2>
                <Labelcomponent>Email</Labelcomponent>
                <Inputfield {...register("eMail", { required: true, pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i })} />
                <Labelcomponent>Password</Labelcomponent>
                <Inputfield type="password" {...register("pswd", { minLength: 8, required: true})} />
                <Inputfieldsubmit className='submit-btn' type="submit"/>
                <span className='copy-r'>{copyRight}</span>
                <a href={navLink} target="blank" rel="noreferrer noopener">navigil.com</a>
            </Formcomponent>
        </Wrapper>
    );
}

export default Loginpage;