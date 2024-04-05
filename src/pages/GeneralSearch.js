import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GeneralSearchStyle.module.css';
import { Form, Button, Fade } from 'react-bootstrap';
import { findClosestStop, roundDown } from '../utilities/LocationUtility';
import { ctb, enterMultipleRoutes, kmb, kmbctb, minute, pleaseInputRoutes, quickSearch, to, unableToDownloadETA } from '../utilities/Locale';
import { extractCtbEta, extractKmbEta, sortCoopEta, downloadJson } from '../utilities/JsonHandler';
import AppBar from '../ui_components/AppBar';
import SpinnerFullscreen from '../ui_components/SpinnerFullscreen';
import ToastAlert from '../ui_components/ToastAlert';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { getStorageItem, getStorageItemDB, setStorageItem, setStorageItemDB } from '../utilities/LocalStorage';
import { now } from 'moment';

const GeneralSearch = ({locationMain, setStartGettingLocation}) => {
    var backBtn = <Icon.ArrowLeft onClick={() => navigate('/', { replace: true })} style={{width:'50px', height:'50px', padding:'10px'}} />;
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const[lang, setLang] = useState('tc');

    const[showKeyboard, setShowKeyboard] = useState(true);
    const[showLoading, setShowLoading] = useState(false);
    const[showContent, setShowContent] = useState(false);

    const[toastText, setToastText] = useState('');
    const[toastTrigger,setToastTrigger] = useState(0);

    const[routeStopList, setRouteStopList] = useState({});
    const[routeList, setRotueList] = useState({});

    const[inputRoutes, setInputRoutes] = useState('');
    const[suggestList, setSuggestList] = useState([]);


    useEffect(() => {
        initialize();
    }, [])

    async function initialize()
    {
        setStartGettingLocation(true);

        var routeListData = await getStorageItemDB('routeList');
        if (Object.keys(routeListData).length == 0)
        {
            navigate('/downloaddata?prevpage=generalsearch', { replace: true });
        }   
        else
        {
            setRotueList(routeListData);
        }

        console.log(routeListData);
        // if (urlParams.has('query'))
        // {
        //     var newInputRoutes = urlParams.get('query');
        //     setInputRoutes(newInputRoutes); 
        //     setTriggerSearch(true);
        // }
        
        setShowContent(true); 
    }

    async function onChangeInputRoutes(letter){
        var currInput = inputRoutes;
        var newInput = '';

        if (letter == 'backspace')
        {
            if (currInput.length > 0)
                newInput = currInput.substring(0, currInput.length-1);
        }
        else if (letter == 'clear')
        {
            newInput = '';
            navigate('', { replace: true });
        }
        else if (letter == '/')
        {
            if (currInput != '' && currInput.charAt(currInput.length-1) != '/')
                newInput = currInput + '/';
            else
                newInput = currInput;
        }
        else
        {
            newInput = currInput + letter;
        }
        

        if (newInput != '')
        {
            var existInputArray = newInput.split('/');
            var existInputMap = {};
            

            if (existInputArray.length >= 2)
            {
                for (var i=0 ; i<existInputArray.length-1 ; i++)
                {
                    existInputMap[existInputArray[i]] = existInputArray[i];
                }
            }
            
            if (existInputArray.length > 0)
            {
                var lastInput = existInputArray[existInputArray.length-1];
                if (lastInput != '')
                {
                    setSuggestList([]);
                    var newSuggestList = [];
                    for (const key in routeList)
                    {
                        const currRoute = key;
                        if (currRoute in existInputMap == false)
                        {
                            if (currRoute.substring(0, lastInput.length) == lastInput)
                                newSuggestList.push(currRoute);
                        }
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 10));
                    setSuggestList(newSuggestList);

                    if (newSuggestList.length == 1)
                    {
                        if (newSuggestList[0] == lastInput && letter != 'backspace')
                            newInput += '/';
                    }
                }
            }
        }
        else
        {
            setSuggestList([]);
        }

        if (newInput.charAt(newInput.length - 1) == '/')
            setSuggestList([]);

        setInputRoutes(newInput);
    }

    return (
        <div className={styles.body}>
            {/* ===== LOADING SPINNER ===== */}
            <SpinnerFullscreen showLoading={showLoading}/>

            {/* ===== TOAST ===== */}
            <ToastAlert toastText={toastText} toastTrigger={toastTrigger}/>

            {/* ===== MAIN CONTENT ===== */}
            <div style={{height:'100vh'}}>

                {/* ===== APP BAR ===== */}
                <AppBar leftIcon={backBtn} Header={quickSearch[lang]} rightIcon={''}></AppBar>

                
                <Fade in={showContent} appear={true} style={{transitionDuration: '0.3s'}}>
                    <div style={{height:'calc(100vh - 50px)'}}>
                    
                        {/* ===== ROUTE INPUT ===== */}
                        <div style={{height:'60px', display:'flex', direction:'column', alignContent:'center', padding:'5px'}}>
                            <Form.Control type="text" value={inputRoutes} placeholder={enterMultipleRoutes[lang]} readOnly={true}/>
                            <Button variant="light" onClick={() => onChangeInputRoutes('clear')}
                                style={{position:'fixed', right:'15px', top: '58px', textAlign:'center', height:'44px', width:'44px', borderRadius:'22px', padding:'0px'}} >
                                <Icon.X style={{height:'25px', width:'25px'}}/>
                            </Button>
                        </div>

                        {/* ===== MAIN COUTE CONTENT ===== */}
                        <div style={ showKeyboard ? 
                            {height:'calc(100dvh - 50px - 60px - 248px)', padding:'5px', overflowY:'hidden', display:'block', 
                            flexDirection:'row', justifyContent:'flex-start', flexWrap:'wrap', overflow: 'auto', scrollbarWidth: 'none',} :
                            {height:'calc(100dvh - 60px - 60px)', padding:'5px', overflowY:'hidden', display:'block', 
                            flexDirection:'row', justifyContent:'flex-start', flexWrap:'wrap', overflow: 'auto', scrollbarWidth: 'none',} 
                        }>

                            {Object.keys(routeList).length > 0 && Object.entries(routeList).map(([key, value]) => (
                                <Fade in={true} appear={true} key={key}>
                                    <div style={{height:'74px', width:'100%', display:'block', textAlign:'center'}} onClick={() => { navigate('/routedetails?routeid='+value['route_id']+'&seq='+(parseInt(value['seq'])-1)); }}>

                                        <div style={{margin:'2px', marginTop:'0px', height:'66px', backgroundColor:'white', display:'flex', borderRadius:'4px', border: '1px solid #e2e2e2', overflow:'hidden', flexDirection:'row'}} >

                                            <div style={{width:'20%', fontSize:'18px'}}>
                                                <div style={{lineHeight:'30px', marginTop:'10px'}}>{value['route']}</div>
                                                <div style={{lineHeight:'15px', fontSize:'11px'}}>
                                                    {value['company'] == 'ctb' ? <div style={{backgroundImage: 'linear-gradient(to right, #fff25c, #fffac2)', marginLeft:'6px', marginRight:'6px', borderRadius:'10px', padding:'1px'}} >{ctb[lang]}</div> : ''}
                                                    {value['company'] == 'kmb' ? <div style={{backgroundImage: 'linear-gradient(to right, #fdaaaa, #fde0e0)', marginLeft:'6px', marginRight:'6px', borderRadius:'10px', padding:'1px'}} >{kmb[lang]}</div> : ''}
                                                    {value['company'] == 'kmbctb' ? <div style={{backgroundImage: 'linear-gradient(to right, #f4c1c1 50%, #fff68f 50%)', marginLeft:'6px', marginRight:'6px', borderRadius:'10px', padding:'1px'}} >{kmbctb[lang]}</div> : ''}
                                                </div>
                                            </div>

                                            <div style={{width:'80%', lineHeight:'60px', textAlign:'left', margin:'4px'}}>
                                                <div style={{display:'flex', flexDirection:'row', height:'100%'}}>
                                                    <div style={{fontSize:'11px', marginTop: '3px'}}>{to[lang]}&nbsp;</div>
                                                    <div style={{fontSize:'17px', overflow:'hidden', wordBreak:'break-all'}}>{value['dest_tc']}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fade>
                            ))}

                        </div>

                        {/* ===== NUM PAD ===== */}

                        {showKeyboard == false ? 
                            <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => setShowKeyboard(!showKeyboard)}
                                style={{position:'fixed', bottom: '0px', width:'50px', height:'50px'}} >
                                <Icon.Keyboard style={{padding:'0px !important',margin:'0px !important'}}/>
                            </Button>
                            : ''                    
                        }
                        
                        {showKeyboard && 
                            <Fade in={true} appear={true} >
                                <div style={showKeyboard ? {height:'248px', borderTop:'1px solid #e2e2e2'} : {display:'none'}}>
                                    <div className={styles.row} >
                                        <div style={{width:'70%', paddingLeft:'2px', paddingRight:'1px'}}>
                                            <div className={styles.row} style={{height:'60px', padding:'2px'}}>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('1')}>1</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('2')}>2</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('3')}>3</Button>
                                            </div>
                                            <div className={styles.row} style={{height:'60px', padding:'2px'}}>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('4')}>4</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('5')}>5</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('6')}>6</Button>
                                            </div>
                                            <div className={styles.row} style={{height:'60px', padding:'2px'}}>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('7')}>7</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('8')}>8</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('9')}>9</Button>
                                            </div>
                                            <div className={styles.row} style={{height:'60px', padding:'2px'}}>
                                                <Button variant="warning" size='lg' className={styles.numPadButton} onClick={() => setShowKeyboard(!showKeyboard)}><Icon.ChevronDown style={{padding:'0px !important',margin:'0px !important'}}/></Button>
                                                <Button variant="danger" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('backspace')}><Icon.Backspace/></Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('0')}>0</Button>
                                            </div>
                                        </div>

                                        <div style={{width:'30%',height:'244px', paddingLeft:'1px', paddingRight:'2px', overflowY:'auto', scrollbarWidth: 'none', paddingBottom:'4px'}}>
                                            <div className={styles.row} style={{height:'60px', padding:'2px'}}>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('X')}>X</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('A')}>A</Button>
                                            </div>
                                            <div className={styles.row} style={{height:'60px', padding:'2px'}}>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('B')}>B</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('C')}>C</Button>
                                            </div>
                                            <div className={styles.row} style={{height:'60px', padding:'2px'}}>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('D')}>D</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('E')}>E</Button>
                                            </div>
                                            <div className={styles.row} style={{height:'60px', padding:'2px'}}>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('F')}>F</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('H')}>H</Button>
                                            </div>
                                            <div className={styles.row} style={{height:'60px', padding:'2px'}}>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('K')}>K</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('M')}>M</Button>
                                            </div>
                                            <div className={styles.row} style={{height:'60px', padding:'2px'}}>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('N')}>N</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('P')}>P</Button>
                                            </div>
                                            <div className={styles.row} style={{height:'60px', padding:'2px'}}>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('R')}>R</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('S')}>S</Button>
                                            </div>
                                            <div className={styles.row} style={{height:'60px', padding:'2px'}}>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('U')}>U</Button>
                                                <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('W')}>W</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Fade>
                        }
                        
                    </div>
                </Fade>
            </div>
        </div>
    )
}

export default GeneralSearch