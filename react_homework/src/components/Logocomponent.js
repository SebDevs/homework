
import React, { useState, useEffect } from 'react';
import styled from 'styled-components'

const Logoimg = styled.img`
    display: flex;
    position: absolute;
    height: 89px;
    width: 302px;
    top: 30px;
    left: 30px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border: none;
    outline: none !important;
`


const Navlogo = () => {
    const baseUrl = "https://dev.navigil.io"
    const [background, setBgImage] = useState('');

    //effect for setting random background image
    useEffect(() => {
        async function getImageUrl() {
            let url = 'https://apidev.navigil.io/base/get-loginpage-settings';
            try {
                const res = await fetch(url);
                return await res.json();
            } catch (error) {
                console.log(error);
            }
        }

        //sets the backgroundimage based on the data returned from getImageUrl function
        const setBackgroundUrl = async () => {
            await getImageUrl()
                .then(data => data.body[0].filter(x => x.setting_name === "hdr-image").pop().data)
                .then(logoImg => setBgImage(logoImg));
        }
        setBackgroundUrl();

    }, [])

    //object for setting the backgorund image for the login page
    const divStyle = {
        backgroundImage: `url(${baseUrl}${background})`
    };

    return (
        <Logoimg className='logo-img' style={divStyle}></Logoimg>
    );
}

export default Navlogo;