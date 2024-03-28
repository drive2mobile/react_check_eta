import { Button, Fade } from "react-bootstrap";
import OSM from "./OSM";
import styles from './RouteDetailsStyle.module.css';
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ctb, kmb, kmbctb, minute, quickSearch, to } from "../utilities/Locale";
import AppBar from "../ui_components/AppBar";
import ToastAlert from "../ui_components/ToastAlert";
import SpinnerFullscreen from "../ui_components/SpinnerFullscreen";
import { getLocationStream } from '../utilities/LocationUtility';

const RouteDetails = () => {
    var locationWatcher = null;
    const locationRef = useRef([]);
    const scrollToRef = useRef(null);
    const[scrollToIndex,setScrollToIndex] = useState(0);

    const urlParams = new URLSearchParams(window.location.search);
    const[lang, setLang] = useState('tc');
    var backBtn = <Button>Back</Button>;
    const[route, setRoute] = useState(null);
    const[dest, setDest] = useState(null);
    var appBarHeader = <span>{route} <span style={{fontSize:'14px'}}> &ensp;&ensp;往 </span> {dest}</span>;

    const[showLoading, setShowLoading] = useState(false);
    const[showContent, setShowContent] = useState(false);

    const[toastText, setToastText] = useState('');
    const[toastTrigger,setToastTrigger] = useState(0);

    const[markers, setMarkers] = useState(null);
    const[mapLocation, setMapLocation] = useState([22.324681505, 114.176558367]);
    const[mapFullscreen, setMapFullscreen] = useState(false);

    const scrollToElement = () => {
        if (scrollToRef.current) {
          scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      };

    function changeMarker(index){
        const updatedMarkers = markers.map((marker, i) => {
            if (i === index) {
                setMapLocation([marker.lat, marker.long]);
                return { ...marker, show: true };
            }
            else { return { ...marker, show: false }; } 
        });

        setMarkers(updatedMarkers);
    }

    useEffect(() => {
        locationWatcher = getLocationStream(locationRef, setToastText, setToastTrigger, lang);
        fetchData();
        async function fetchData(){
            const response4 = await fetch(`https://webappdev.info:8081/kmbroutestoplist`);
            const data4 = await response4.json();
    
            // const response5 = await fetch(`${process.env.PUBLIC_URL}/json/ctb/FINAL_route_stop_list.json`);
            const response5 = await fetch(`https://webappdev.info:8081/ctbroutestoplist`);
            const data5 = await response5.json();
    
            const data6 = { ...data4, ...data5 };

            const routeid = urlParams.get('routeid');
            const seq = urlParams.has('seq') ? urlParams.get('seq') : 0;
            
            if (routeid in data6)
            {   
                setRoute(data6[routeid][0]['route']);
                setDest(data6[routeid][0]['dest_' + lang]);
                setMarkers(data6[routeid]);
                setMapLocation([data6[routeid][seq]['lat'], data6[routeid][seq]['long']]);
            }
            // scrollToRef.current = urlParams.has('seq') ? urlParams.get('seq') : 0;
            
        }
        setShowContent(true);
        setScrollToIndex(urlParams.has('seq') ? parseInt(urlParams.get('seq')) : 0);
        // changeMarker(urlParams.has('seq') ? parseInt(urlParams.get('seq')) : 0);
        return () => {
            navigator.geolocation.clearWatch(locationWatcher);
        };
    }, [])

    useEffect(()=>{
        scrollToElement();
    },[scrollToElement])


    return (
        <div className={styles.body}>
            {/* ===== LOADING SPINNER ===== */}
            <SpinnerFullscreen showLoading={showLoading}/>

            {/* ===== TOAST ===== */}
            <ToastAlert toastText={toastText} toastTrigger={toastTrigger}/>

            {/* ===== MAIN CONTENT ===== */}
            <div style={{height:'100vh'}}>

                {/* ===== APP BAR ===== */}
                <AppBar leftIcon={backBtn} Header={appBarHeader} rightIcon={''}></AppBar>

                <div style={{height: 'calc(100dvh - 50px)'}}>
                    <Fade in={true} appear={true}>
                        <OSM markers={markers} setMarkers={setMarkers} mapLocation={mapLocation} setMapLocation={setMapLocation} 
                        lang={lang} fullscreen={mapFullscreen} setFullscreen={setMapFullscreen} locationRef={locationRef}/>
                    </Fade>

                    <div style={mapFullscreen ? {height: '0%', overflow: 'auto', scrollbarWidth: 'none', padding:'5px'} : {height: '55%', overflow: 'auto', scrollbarWidth: 'none', padding:'5px'}} >
                    {markers && markers.map((item, index) => (
                        <Fade in={true} appear={true} >
                            <div ref={index === scrollToIndex ? scrollToRef : null} style={{height:'74px', width:'100%', display:'block', textAlign:'center'}} onClick={()=> {changeMarker(index)}}>

                                <div style={{margin:'2px', marginTop:'0px', height:'66px', backgroundColor:'white', display:'flex', borderRadius:'4px', border: '1px solid #e2e2e2', overflow:'hidden', flexDirection:'row'}} >

                                    <div style={{width:'20%', fontSize:'18px'}}>
                                        <div style={{lineHeight:'30px', marginTop:'10px'}}>{item['route']}</div>
                                        <div style={{lineHeight:'15px', fontSize:'11px'}}>
                                            {item['company'] == 'ctb' ? <div style={{backgroundImage: 'linear-gradient(to right, #fff25c, #fffac2)', marginLeft:'6px', marginRight:'6px', borderRadius:'10px', padding:'1px'}} >{ctb[lang]}</div> : ''}
                                            {item['company'] == 'kmb' ? <div style={{backgroundImage: 'linear-gradient(to right, #fdaaaa, #fde0e0)', marginLeft:'6px', marginRight:'6px', borderRadius:'10px', padding:'1px'}} >{kmb[lang]}</div> : ''}
                                            {item['company'] == 'kmbctb' ? <div style={{backgroundImage: 'linear-gradient(to right, #f4c1c1 50%, #fff68f 50%)', marginLeft:'6px', marginRight:'6px', borderRadius:'10px', padding:'1px'}} >{kmbctb[lang]}</div> : ''}
                                        </div>
                                    </div>

                                    <div style={{width:'60%', lineHeight:'30px', textAlign:'left', margin:'4px'}}>
                                        <div style={{display:'flex', flexDirection:'row', height:'50%'}}>
                                            <div style={{fontSize:'11px', marginTop: '3px'}}>{to[lang]}&nbsp;</div>
                                            <div style={{fontSize:'17px', overflow:'hidden', wordBreak:'break-all'}}>{item['dest_tc']}</div>
                                        </div>
                                        <div style={{height:'50%', fontSize:'17px'}}>{item['name_tc']}</div>
                                    </div>
                                    <div style={{width:'20%', lineHeight:'20px'}}>
                                        <div style={{display:'flex', flexDirection:'row', height:'33%'}}>
                                            <div style={{width:'50%', textAlign:'right'}}>{item['eta1']}&nbsp;</div>
                                            <div style={{width:'50%', textAlign:'left', fontSize:'11px', marginTop: 'auto'}}>{minute[lang]}</div>
                                        </div>
                                        <div style={{display:'flex', flexDirection:'row', height:'33%'}}>
                                            <div style={{width:'50%', textAlign:'right'}}>{item['eta2']}&nbsp;</div>
                                            <div style={{width:'50%', textAlign:'left', fontSize:'11px', marginTop: 'auto'}}>{minute[lang]}</div>
                                        </div>
                                        <div style={{display:'flex', flexDirection:'row', height:'33%'}}>
                                            <div style={{width:'50%', textAlign:'right'}}>{item['eta3']}&nbsp;</div>
                                            <div style={{width:'50%', textAlign:'left', fontSize:'11px', marginTop: 'auto'}}>{minute[lang]}</div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </Fade>
                    ))}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default RouteDetails;