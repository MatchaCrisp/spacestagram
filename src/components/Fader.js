import React, { useEffect, useState} from 'react';
import '../stylesheets/Fader.scss';
const Fader=({visible, children})=>{
    const [ren,setRen]=useState(visible);

    useEffect(()=>{
        if (visible){
            setRen(true);
        }
    },[visible]);

    const onAnimFin=()=>{
        if (!visible){
            setRen(false);
        }
    }

    return (
        ren && (
            <div
                style={{animation:`${visible?"in":"out"} 500ms`,
                        position:"relative"}}
                onAnimationEnd={onAnimFin}
            >
                {children}
            </div>
        )
    );
};

export default Fader;