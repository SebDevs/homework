
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import Navlogo from './Logocomponent';

const Wrapper = styled.div`
    display: flex;
    justify-content: start;
    flex-direction: column;
    align-items: center;
    height: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    font-family: 'Lato', sans-serif;
    margin-top: 78px;
`
const Inputfield = styled.input`
    margin: 10px;
    height: 25px;
    border-radius: 6px;
    border: 1px solid #dadada;
    padding: 3px;
`
const Langlist = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px;
    line-height: 1px;
`
const Langitem = styled.p`
    padding: 2px;
    margin-left: 5px;
    cursor: pointer;
`
const Langwrapper = styled.div`
    background: white;
    display: flex;
    justify-content: start;
    flex-direction: column;
    -webkit-box-shadow: 0px 0px 14px 4px #f0f0f0; 
    box-shadow: 0px 0px 14px 4px #f0f0f0;
    width: 430px;
    margin-top: 20px;

`
const Submitbtn = styled.button`
    padding: 2px 14px;
    border-radius: 5px;
    border: none;
    background-color: #58ddff;
    color: white;
    margin: 6px;
    cursor: pointer;
`
const LogoutBtn = styled(Submitbtn)`
    position: absolute;
    right: 30px;
    top: 30px;
    padding: 10px;
    background-color:  #f7b8ff;
   
`
const Inputgoup = styled.div`
    display: flex;
    flex-direction: row;
`
const Homepage = () => {
    
    const baseUrl = "https://apidev.navigil.io/lang/list-locale"
    const [languages, setLanguages ] = useState([]);
    const [text, setText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [displaySuggestions, setDispplaySuggestion] = useState(true);
    const [languageKeys, setLanguageKeys] = useState([]);
    const [goupNames, setGroupnames] = useState([]);
    const [translations, setTranslations] = useState([]);
    const [displayTranslations, setDisplayTranslations] = useState(false);
    const [groupOtion, setGroupOption] = useState('')
    const [displayGroupsList, setdisplayGroupsList ] = useState(false);
    const [btnState, setbtnState] = useState('Show group names');
    


    //get languages
    useEffect(() => {
        const loadLanguages = async() => {
            const response = await fetch(baseUrl)
            return await response.json();
        }
        loadLanguages().then(data => data.body.forEach(x => {
            if(x.languageNameOrig && suggestions.length === 0){
            setLanguages(old => [...old,x.languageNameOrig])
        }
        setLanguageKeys(prevState => ({
            keys: {
              ...prevState.keys,
              [x.languageNameOrig]: (x.locale)
            }
          }))
    }))
    },[]);
    

    const onChangeHandler = (text) => {
        console.log(text)
        let matchingText = [];
        if(text.length > 0) {
            matchingText = languages.filter(lang => {
                const regex = new RegExp(`${text}`, "gi");
                return lang.match(regex);
            })
        }
        setSuggestions(matchingText)
        setText(text);
    }

    const onLanguageSelect = (text) => {
        setText(text);
        setSuggestions([]);
        setDispplaySuggestion(false)
    }
    const toggleVisibility = (event) => {
        event.stopPropagation();
        setDispplaySuggestion(true)
        setdisplayGroupsList(false)
        setDisplayTranslations(false)
    }
    const toggleState = (event) => {
        event.stopPropagation();
        setTimeout(() => {
            setDisplayTranslations(true)
            setdisplayGroupsList(false)
        },3000)
        
    }

    const uiUrl = "https://apidev.navigil.io/lang/list-language-data-UI"
    const loadLangkeys = async() => {
            const response = await fetch(uiUrl)
            return await response.json();
    }
    const handleSubmit = async () => {
        const selectedLang = {languageKeys}.languageKeys.keys[{text}.text];
        await loadLangkeys()
        .then(x => setGroupnames(Object.keys(x.body[selectedLang]))).finally(setdisplayGroupsList(true))
    }

    const getTranslations = async (data) =>{
            const response = await fetch(uiUrl)
            const jsonResponse = await response.json();
            return  {jsonResponse,data}
    }
    
    const showTanslations = async (langOpt) =>{
        setGroupOption(langOpt)
        return await getTranslations(langOpt)
        .then((data) => data.jsonResponse.body[{languageKeys}.languageKeys.keys[{text}.text]])
        .then(x => setTranslations(x))
    }
    const handleLogout = () => {
        localStorage.clear();
        window.location.pathname = "/login"
    }
    const langList = languages.sort()            
    const sortedLangs = suggestions.length === 0 ? 
        langList.map((lang, i) => (
            <Langlist className='lang-item' key={i}>
                <Langitem onClick={() => onLanguageSelect(lang) }>{lang}</Langitem >
            </Langlist>))
    : suggestions.map((lang, i) => (
        <Langlist className='lang-item' key={i}>
            <Langitem onClick={() => onLanguageSelect(lang) }>{lang}</Langitem >
        </Langlist>))

    const groupsList = {goupNames}.goupNames.map((langOpt, ie) => (
        <Langlist className='lang-item' key={ie}>
                <Langitem onClick={(e) => (showTanslations(langOpt), toggleState(e)) }>{langOpt}</Langitem >
            </Langlist>
    )); 

    return (
        
        <Wrapper className='wrapper'>
            <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
            <Inputgoup>
            <Inputfield type="text" 
                onChange={e=>onChangeHandler(e.target.value)}
                onFocus={toggleVisibility}
                value={text}
                />
                <Submitbtn onClick={handleSubmit}>{btnState}</Submitbtn>
            </Inputgoup>
           
                { displaySuggestions ? 
                <Langwrapper className="lang-list">
                {sortedLangs}
                </Langwrapper>
                : null }
                { displayGroupsList ? 
                <Langwrapper className="lang-list groups">
                { groupsList }
                </Langwrapper>
                : null }
                { displayTranslations? 
                <Langwrapper className="lang-list">
                    {Object.keys(translations[groupOtion]).map((keyName, i) => (
                    
                        <span key={i} className="input-label"><b>{keyName}</b> : {translations[groupOtion][keyName]}</span>
                ))}
                </Langwrapper>
                : null }
        </Wrapper>
    );
}

export default Homepage;