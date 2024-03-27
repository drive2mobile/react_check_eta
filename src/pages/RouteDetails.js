import { Button, Fade } from "react-bootstrap";
import OSM from "./OSM";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ctb, kmb, kmbctb, minute, to } from "../utilities/Locale";

const RouteDetails = () => {
    // const [markers, setMarkers] = useState(
    //         [{ lat: 22.324681505, long: 114.176558367, stop: 'ABC', show: false },
    //         { lat: 22.310990127607496, long: 114.16906865641283, stop: 'DEF', show: false }]
    //     );
    const[lang, setLang] = useState('tc');
        const [markers, setMarkers] = useState(
            null
        );
    const [mapLocation, setMapLocation] = useState([22.324681505, 114.176558367]);
    const { routeid } = useParams();
    const [mapFullscreen, setMapFullscreen] = useState(false);

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
        fetchData();
        async function fetchData(){
            const response4 = await fetch(`https://webappdev.info:8081/kmbroutestoplist`);
            const data4 = await response4.json();
    
            // const response5 = await fetch(`${process.env.PUBLIC_URL}/json/ctb/FINAL_route_stop_list.json`);
            const response5 = await fetch(`https://webappdev.info:8081/ctbroutestoplist`);
            const data5 = await response5.json();
    
            const data6 = { ...data4, ...data5 };
            
            if (routeid in data6)
            {
                setMarkers(data6[routeid]);
            }
        }

    }, [])

    return (
        <div>
            <div style={{height:'40px'}}>
                <h1>RouteDetails {routeid}</h1>
            </div>
            
            <div style={{height: 'calc(100dvh - 40px)'}}>
                <Fade in={true} appear={true}>
                    <OSM markers={markers} setMarkers={setMarkers} mapLocation={mapLocation} setMapLocation={setMapLocation} 
                     lang={lang} fullscreen={mapFullscreen} setFullscreen={setMapFullscreen}/>
                </Fade>

                <div style={mapFullscreen ? {height: '0%', overflow:'scroll' } : {height: '50%', overflow:'scroll' }}>
                {markers && markers.map((item, index) => (
                    <Fade in={true} appear={true} >
                        <div style={{height:'74px', width:'100%', display:'block', textAlign:'center'}} onClick={()=> {changeMarker(index)}}>

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
    )
}

export default RouteDetails;