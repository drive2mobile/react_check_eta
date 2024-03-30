import { Button, Fade } from "react-bootstrap";
import OSM from "../ui_components/OSM";
import styles from './RouteDetailsStyle.module.css';
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ctb, kmb, kmbctb, minute, quickSearch, to } from "../utilities/Locale";
import AppBar from "../ui_components/AppBar";
import ToastAlert from "../ui_components/ToastAlert";
import SpinnerFullscreen from "../ui_components/SpinnerFullscreen";
import * as Icon from 'react-bootstrap-icons';
import { downloadJson, extractCtbEta, extractKmbEta, sortCoopEta } from "../utilities/JsonHandler";
import axios from "axios";

const RouteDetails = ({locationMain}) => {

    const urlParams = new URLSearchParams(window.location.search);
    const navigate = useNavigate();
    const[lang, setLang] = useState('tc');
    const[timer, setTimer] = useState(null);

    const[route, setRoute] = useState(null);
    const[dest, setDest] = useState(null);
    var backBtn = <Icon.ArrowLeft onClick={() => navigate(-1)} style={{width:'50px', height:'50px', padding:'10px'}} />;
    var appBarHeader = <span>{route} <span style={{fontSize:'14px'}}> &ensp;&ensp;往 </span> {dest}</span>;
    
    const[showLoading, setShowLoading] = useState(false);
    const[showContent, setShowContent] = useState(false);

    const[toastText, setToastText] = useState('');
    const[toastTrigger,setToastTrigger] = useState(0);

    const[stopMarkers, setStopMarkers] = useState(null);
    const[mapLocation, setMapLocation] = useState([22.324681505, 114.176558367]);
    const[mapFullscreen, setMapFullscreen] = useState(false);
    const[selectedIndex, setSelectedIndex] = useState(0);

    const[triggerShowMarkerLabel, setTriggerShowMarkerLabel] = useState(false);
    const[triggerScrollToIndex, setTriggerScrollToIndex] = useState(false);
    const[triggerDownload, setTriggerDownload] = useState(false);
    const[triggerAutoDownload, setTriggerAutoDownload] = useState(false);

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        setTriggerAutoDownload(false);
        downloadEta();
        setTriggerAutoDownload(true);
    }, [triggerDownload])

    useEffect(() => {
        showMarkerLabel();
    }, [triggerShowMarkerLabel])

    useEffect(() => {
        scrollToIndex();
    }, [triggerScrollToIndex])

    useEffect(() => {
        let timerConstant = null;
        if (triggerAutoDownload) 
        {
            timerConstant = setInterval(() => {
                setTriggerDownload(true);
            }, 1000*30);
            
            setTimer(timerConstant);
        } 
        else if (triggerAutoDownload === false) 
        {
            if (timer) 
            {
                clearInterval(timer);
                setTimer(null);
            }
        }

        return () => {
            if (timer) 
            {
                clearInterval(timer);
                setTimer(null);
            }
        };

    }, [triggerAutoDownload])

    async function initialize(){
        setShowLoading(true);
        const data4 = await downloadJson(`https://webappdev.info:8081/kmbroutestoplist`, setShowLoading, setToastText, setToastTrigger);
        const data5 = await downloadJson(`https://webappdev.info:8081/ctbroutestoplist`, setShowLoading, setToastText, setToastTrigger);
        const data6 = { ...data4, ...data5 };

        const routeid = urlParams.get('routeid');
        const seq = urlParams.has('seq') ? parseInt(urlParams.get('seq')) : 0;
        
        if (routeid in data6)
        {   
            var routeStopList = data6[routeid];
            routeStopList[seq]['show'] = true;
            setRoute(routeStopList[0]['route']);
            setDest(routeStopList[0]['dest_' + lang]);
            setStopMarkers(routeStopList);
        }
        setShowLoading(false);
        setShowContent(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setSelectedIndex(seq);
        setTriggerScrollToIndex(true);
        setTriggerShowMarkerLabel(true);
        setTriggerDownload(true);
    }

    function showMarkerLabel(){
        if (triggerShowMarkerLabel)
        {
            const updatedMarkers = stopMarkers.map((currStopMarker, i) => {
                if (i === selectedIndex) {
                    setMapLocation([currStopMarker.lat, currStopMarker.long]);
                    return { ...currStopMarker, show: true };
                }
                else { return { ...currStopMarker, show: false }; } 
            });
    
            setStopMarkers(updatedMarkers);
            setTriggerShowMarkerLabel(false);
        }
    }

    function scrollToIndex(){
        if (triggerScrollToIndex)
        {
            const element = document.getElementById(`element-${selectedIndex}`);
            if (element) 
            {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            setTriggerScrollToIndex(false);
        }
    };

    async function downloadEta(){
        const updateElementByIndex = (index, newValue) => {
            setStopMarkers(prevArray => {
              const updatedArray = [...prevArray];
              updatedArray[index] = newValue;
              return updatedArray;
            });
        };

        if (triggerDownload)
        {
            try
            {
                console.log('download');
                var currItem = stopMarkers[selectedIndex];
                var company = stopMarkers[selectedIndex]['company'];

                if (company == 'kmb')
                {
                    const url = `https://data.etabus.gov.hk/v1/transport/kmb/eta/${currItem['stop']}/${currItem['route']}/1`;
                    const response = await axios.get(url);
                    const resultArray = extractKmbEta(response.data, stopMarkers[selectedIndex]['direction']);
                    stopMarkers[selectedIndex]['eta1'] = resultArray[0];
                    stopMarkers[selectedIndex]['eta2'] = resultArray[1];
                    stopMarkers[selectedIndex]['eta3'] = resultArray[2];
                }
                else if (company == 'ctb')
                {
                    const url = `https://rt.data.gov.hk/v2/transport/citybus/eta/ctb/${currItem['stop']}/${currItem['route']}`;
                    const response = await axios.get(url);
                    const resultArray = extractCtbEta(response.data, stopMarkers[selectedIndex]['direction']);
                    stopMarkers[selectedIndex]['eta1'] = resultArray[0];
                    stopMarkers[selectedIndex]['eta2'] = resultArray[1];
                    stopMarkers[selectedIndex]['eta3'] = resultArray[2];
                }
                else if (company == 'kmbctb')
                {
                    const urlKmb = `https://data.etabus.gov.hk/v1/transport/kmb/eta/${currItem['stop']}/${currItem['route']}/1`;
                    const responseKmb = await axios.get(urlKmb);
                    const resultArrayKmb = extractKmbEta(responseKmb.data, stopMarkers[selectedIndex]['direction']);

                    const urlCtb = `https://rt.data.gov.hk/v2/transport/citybus/eta/ctb/${currItem['coopStop']}/${currItem['route']}`;
                    const responseCtb = await axios.get(urlCtb);
                    const resultArrayCtb = extractCtbEta(responseCtb.data, stopMarkers[selectedIndex]['coopDir']);

                    const combinedArray = [...resultArrayKmb, ...resultArrayCtb];
                    const resultArray = sortCoopEta(combinedArray);

                    stopMarkers[selectedIndex]['eta1'] = resultArray[0];
                    stopMarkers[selectedIndex]['eta2'] = resultArray[1];
                    stopMarkers[selectedIndex]['eta3'] = resultArray[2];
                }

                stopMarkers[selectedIndex]['show'] = true;
                updateElementByIndex(selectedIndex, stopMarkers[selectedIndex]);
                // setTriggerAutoDownload(true);
            }
            catch(error)
            {
                // setToastText(unableToDownloadETA[lang]);
                // setToastTrigger((prev) => prev+1);
            }
            setTriggerDownload(false);
        }
    }

    return (
        <div className={styles.body}>
            {/* ===== LOADING SPINNER ===== */}
            <SpinnerFullscreen showLoading={showLoading}/>

            {/* ===== TOAST ===== */}
            <ToastAlert toastText={toastText} toastTrigger={toastTrigger}/>

            {/* ===== MAIN CONTENT ===== */}
            <div style={{height:'100dvh'}}>

                {/* ===== APP BAR ===== */}
                <AppBar leftIcon={backBtn} Header={appBarHeader} rightIcon={''}></AppBar>

                <div style={{height: 'calc(100dvh - 50px)'}}>
                    {showLoading == false ?
                        <OSM 
                            lang={lang} 
                            fullscreen={mapFullscreen} 
                            selectedIndex={selectedIndex}
                            setFullscreen={setMapFullscreen} 
                            mapLocation={mapLocation} 
                            stopMarkers={stopMarkers} 
                            locationMain={locationMain}
                            setSelectedIndex={setSelectedIndex}
                            setTriggerScrollToIndex={setTriggerScrollToIndex} 
                            setTriggerShowMarkerLabel={setTriggerShowMarkerLabel}
                            setTriggerDownload={setTriggerDownload}
                        /> : ''
                    }

                    <div style={mapFullscreen ? {height: '0%', overflow: 'auto', scrollbarWidth: 'none', padding:'0px'} : {height: '55%', overflow: 'auto', scrollbarWidth: 'none', paddingTop:'5px', paddingBottom:'5px'}} >
                    {stopMarkers && stopMarkers.map((item, index) => (
                        <Fade in={true} appear={true} >
                            <div id={`element-${index}`} key={index} 
                                onClick={()=> {setSelectedIndex(index); setTriggerShowMarkerLabel(true); setTriggerDownload(true); }}
                                style={ index === selectedIndex ? 
                                    {height:'74px', width:'100%', display:'block', textAlign:'center', lineHeight:'60px', padding:'5px'} :
                                    {height:'54px', width:'100%', display:'block', textAlign:'center', lineHeight:'40px', padding:'5px'} 
                                } 
                            >

                                <div style={index === selectedIndex ? 
                                    {margin:'2px', marginTop:'0px', height:'66px', backgroundColor:'white', display:'flex', borderRadius:'4px', border: '1px solid #e2e2e2', overflow:'hidden', flexDirection:'row'}:
                                    {margin:'2px', marginTop:'0px', height:'46px', backgroundColor:'white', display:'flex', borderRadius:'4px', border: '1px solid #e2e2e2', overflow:'hidden', flexDirection:'row'}} 
                                >
                                
                                    <div style={{width:'10%', textAlign:'right', margin:'4px'}}>
                                        {item['seq'] + '.'}
                                    </div>
                                    <div style={{width:'70%', textAlign:'left', margin:'4px'}}>
                                        {item['name_tc']}
                                    </div>
                                    
                                    {index === selectedIndex ?
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
                                        </div>:''
                                    }   
                                    
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