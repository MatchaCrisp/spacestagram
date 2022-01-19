import React, {useState, useEffect} from 'react';
import Item from './components/Item';
import Fader from './components/Fader';
import Button from '@mui/material/Button';
// date range picker
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

// TODO: figure out intuitive way to store dates and const dates
const App=()=>{
    // constants
    const HR_TO_MS=60*60*1000;
    const DAY_MS=24*HR_TO_MS;
    const MIN_DATE=new Date('1995-06-16T00:00:00');
    const MAX_DATE=new Date(Date.now());
    const MIN_DATE_MS=MIN_DATE.getTime();
    const MAX_DATE_MS=MAX_DATE.getTime();

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

    // used by range picker
    const handleSelection=(r)=>{
        if (r.selection.endDate>MAX_DATE){
            r.selection.endDate=MAX_DATE;
        }
        setRange(r.selection);
    }

    // confirms user selection to dates for display
    const handleSubmit=()=>{
        if (range.startDate.getTime()<MIN_DATE_MS || range.endDate.getTime()>MAX_DATE_MS){
            return;
        }

        setDates(range);
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
    const renderContent=()=>{
        console.log(dates.startDate,dates.endDate);
        const sd=dates.startDate.getTime();
        const ed=dates.endDate.getTime();
        console.log(sd,ed);
        if (sd===ed){
            return (
                    <Fader visible={true}>
                        <Item url={genUrl(genDateStr(dates.startDate))} 
                        isSingle={true} />
                    </Fader>
            )
        }
        else {
            const jsx=[];

            for (let currDms=sd;currDms<=ed;currDms+=DAY_MS){
                const currD=new Date(currDms);
                jsx.push(<Fader visible={true}><Item url={genUrl(genDateStr(currD))} key={currD} isSingle={false} /></Fader>);
            }
            return jsx;
        }
    }
    return (
        <div>
            <div className="datePicker">
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
            <div>
                {renderContent()}
            </div>
        </div>
        
    )
}

export default App;