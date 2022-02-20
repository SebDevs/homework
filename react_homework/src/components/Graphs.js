
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';

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
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
const Chartdata = () => {
    const [langOptions, setOptions] = useState(null);
    const [langPairs, setLangPairs] = useState(null)
    const baseUrlChart = "https://apidev.navigil.io/lang/list-language-data-UI"


    useEffect(() =>  {
        let langArr = [];
        const getCountData = async () => {
            try {
                const response = await fetch(baseUrlChart)
                const result = await response.json()
                const langList = Object.keys(result.body)

                const pairs = async() => {
                    langList.forEach(lang => {
                        let sum = 0;
                        Object.keys(result.body[lang]).forEach(function(x) {
                            sum += Object.keys(result.body[lang][x]).length;
                        })
                        langArr.push([lang, sum])
                    })
                    
                }
                
                await pairs().then(setLangPairs(langArr))
                .then(setOptions(langList))
    
    
              } catch (error) {
                console.log("error", error)
              }
        }
        getCountData()
        
        
    },[]);

    const labels = langOptions || [];
    const colorArr = ["#FC4445","#3FEEE6","#55BCC9","#97CAEF","#CAFAFE"]
    const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Language Statistics',
      },
    },
  };
 const data = langPairs && {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: langPairs.map(z => z[1]),
        backgroundColor: colorArr[Math.floor(Math.random() * colorArr.length)],
      },
    ],
  } || [];

  const tableColumns = [
    {
        name: 'Languegecode',
        selector: row => row.language,
    },
    {
        name: 'Count',
        selector: row => row.amount,
    },
];

const tableData = langPairs && Array.from(langPairs, ([language, amount]) => ({ language, amount}));
    return (
        
        <Wrapper className='wrapper'>
            
            {langOptions && langPairs &&
                <Bar className='bar-chart' options={options} data={data} />
            }
            {langPairs &&
                <h2>Languages and sum of available languageterms</h2>
            }
            
            {langPairs && tableData &&
                
                <DataTable className='table-data'
                columns={tableColumns}
                data={tableData}
            />
            }
            
        </Wrapper>
    );
}

export default Chartdata;