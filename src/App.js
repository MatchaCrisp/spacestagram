import React, {useState} from 'react';
import Item from './components/Item';
import Fader from './components/Fader';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
// date range picker
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

import './stylesheets/App.scss';
// TODO: figure out intuitive way to store dates and const dates
const App=()=>{
    // constants
    const HR_TO_MS=60*60*1000;
    const DAY_MS=24*HR_TO_MS;
    const MIN_DATE=new Date('1995-06-16T00:00:00');
    const MAX_DATE=new Date(Date.now());
    const MIN_DATE_MS=MIN_DATE.getTime();
    const MAX_DATE_MS=MAX_DATE.getTime();

    // media query breakpoint
    const isLarge=useMediaQuery('(min-width:1200px)');

    // user date range selection
    const [range, setRange]=useState({
        startDate:new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    // date range used to display current pictures
    const [dates,setDates]=useState({
        startDate:new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    // dialogue open state
    const [warn,setWarn]=useState(false);

    const warnFunc={
        open:()=>setWarn(true),
        close:()=>setWarn(false)
    }

    const [err,setErr]=useState(false);

    const errFunc={
        open:()=>setErr(true),
        close:()=>setErr(false)
    }
    const [conf,setConf]=useState(false);
    const confFunc={
        open:()=>setConf(true),
        close:(action)=>{
            if (action){
                setDates(range);
            }   
            setConf(false);
        }
    }
    // used by range picker
    const handleSelection=(r)=>{
        if (r.selection.endDate>MAX_DATE){
            r.selection.endDate=MAX_DATE;
        }
        setRange(r.selection);
    }

    // confirms user selection to dates for display
    const handleSubmit=()=>{
        const sd=range.startDate.getTime();
        const ed=range.endDate.getTime();
        const nDays=(ed-sd)/DAY_MS+1;

        if (sd<MIN_DATE_MS || ed>MAX_DATE_MS){
            errFunc.open();
        }
        else if (nDays>=60){
            warnFunc.open();
        }
        else if (nDays>=20){
            confFunc.open();
        }
        else {
            setDates(range);
        }
        
    }

    // converts date str to nasa api url
    const genUrl=(dateStr)=>{
        const formatReg=/^\d{4}-\d{1,2}-\d{1,2}$/;
        if (formatReg.test(dateStr)){
            return `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY_NASA}&date=${dateStr}&thumbs=true`;
        }

        return null;
    }

    // converts date object to date string
    const genDateStr=(date)=>{
        if (date && date instanceof Date && !isNaN(date)){
            const da={y:date.getFullYear(),
                      m:date.getMonth()+1,
                      d:date.getDate()};
            return `${da.y}-${da.m}-${da.d}`;
        }

        return null;
    }

    const renderDialog = (open, {title, msg, handleClose, butt1, butt2}, key) => {
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                key={key}
            >
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {msg}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {butt1}
                    {butt2}
                </DialogActions>
            </Dialog>
        )
    }

    const renderDialogs=()=>{
        const warnItem={
            title:"It's not you! It's us!",
            msg:"This many requests can exceed our API request limit to NASA quickly, would you mind maybe viewing less at a time? Thanks!",
            handleClose:warnFunc.close,
            butt1:null,
            butt2:<Button variant="outlined" onClick={warnFunc.close} autoFocus>Okay!</Button>
        };

        const errItem={
            title:"Oops!",
            msg:"You tried to view a picture that's either earlier than 1995-06-16 or in the future! (How did you do that?)",
            handleClose:errFunc.close,
            butt1:null,
            butt2:<Button variant="outlined" onClick={errFunc.close} autoFocus>Try again.</Button>
        };

        const confItem={
            title:"Hold on!",
            msg:"You are trying to view a whole lotta images at the same time there, you sure this is what you want?",
            handleClose:()=>confFunc.close(false),
            butt1:<Button variant="contained" onClick={()=>confFunc.close(true)}>I'm sure!</Button>,
            butt2:<Button variant="outlined" onClick={()=>confFunc.close(false)} autoFocus>Take me back.</Button>
        }

        return (
            <div>
                {renderDialog(warn, warnItem,"warning")}
                {renderDialog(err, errItem,"error")}
                {renderDialog(conf, confItem,"confirmation")}
            </div>
        )
    }
    const renderContent=()=>{

        const sd=dates.startDate.getTime();
        const ed=dates.endDate.getTime();

        if (sd===ed){
            const url=genUrl(genDateStr(dates.startDate));

            if (url===null){
                return null;
            }
            return (
                    <Fader visible={true}>
                        <Item url={url} 
                        isSingle={true} />
                    </Fader>
            )
        }
        else {
            const jsx=[];

            for (let currDms=sd;currDms<=ed;currDms+=DAY_MS){
                const currD=new Date(currDms);
                const url=genUrl(genDateStr(currD));
                if (url != null){
                    jsx.push(<Fader visible={true} key={currD}><Item url={genUrl(genDateStr(currD))}  isSingle={false} /></Fader>);
                }
                
            }
            return jsx;
        }
    }
    return (
        <div className="app">
            {renderDialogs()}
            <div className={`datePicker-${isLarge?"lg":"sm"}`}>
                <Typography variant="h2" align="center" sx={{color:"white"}}>SpaceStagram!</Typography>
                <DateRangePicker
                    ranges={[range]}
                    onChange={handleSelection}
                    minDate={MIN_DATE}
                    maxDate={MAX_DATE}
                />
                <Button onClick={handleSubmit}
                    variant="contained">
                    View Selection!
                </Button>
            </div>
            <div className={`content-${isLarge?"lg":"sm"}`}>
                {renderContent()}
            </div>
        </div>
        
    )
}

export default App;