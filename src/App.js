import React from 'react';
import Item from './components/Item';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';

const App=()=>{
    const url=`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY_NASA}&date=2022-01-15&thumbs=true`
    return (
        <Item url={url} />
    )
}

export default App;