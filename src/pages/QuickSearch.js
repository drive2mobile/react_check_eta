import AppBar from '../ui_components/AppBar';
import styles from './QuickSearchStyle.module.css';
import { useState, useEffect, useRef  } from 'react';
import { Form, Button, Fade, Spinner, Toast } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { getLocation, addInterval, minusInterval, roundDown, calculateDistance, findClosestStop } from '../utilities/LocationUtility';
import { enterMultipleRoutes, minute, quickSearch, to } from '../utilities/Locale';
import axios from 'axios';
import { extractKmbEta } from '../utilities/JsonExtract';

const QuickSearch = () => {
    const[lang, setLang] = useState('tc');

    const[showLoading, setShowLoading] = useState(true);
    const[showContent, setShowContent] = useState(false);

    const[showToast, setShowToast] = useState(false);
    const[toastText, setToastText] = useState('');
    const[activeTimeout, setActiveTimeout] = useState('');

    const locationRef = useRef([]);
    const gettingLocationRef = useRef(false);

    const[inputRoutes, setInputRoutes] = useState('');
    const[suggestList, setSuggestList] = useState({});

    const[locationBasedList, setLocationBasedList] = useState({});
    const[routeStopList, setRouteStopList] = useState({});
    const[routeList, setRotueList] = useState({});

    const[etaList, setEtaList] = useState([]);
    const[downloadTrigger, setDownloadTrigger] = useState(1);

    const onClickSearch = async() => {
        if (inputRoutes != '')
        {
            setShowLoading(true);

            while (gettingLocationRef.current == true)
            {
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            var newEtaList = [];
            var inputRoutesArray = inputRoutes.split('/');
            for (var i=0 ; i<inputRoutesArray.length ; i++)
            {
                var currRouteIdArray = ['kmb' + inputRoutesArray[i] + '_I1','kmb' + inputRoutesArray[i] + '_O1',
                                        'ctb' + inputRoutesArray[i] + '_I1','ctb' + inputRoutesArray[i] + '_O1',
                                        'kmbctb' + inputRoutesArray[i] + '_I1','kmbctb' + inputRoutesArray[i] + '_O1',];
    
                for (var j=0 ; j<currRouteIdArray.length ; j++)
                {
                    if (currRouteIdArray[j] in routeStopList)
                    {
                        var closestStop = findClosestStop(locationRef.current[0], locationRef.current[1], routeStopList[currRouteIdArray[j]]);

                        if (closestStop != null) 
                        {
                            closestStop['eta1'] = '-';
                            closestStop['eta2'] = '-';
                            closestStop['eta3'] = '-';
                            newEtaList.push(closestStop);
                        }
                            
                    }  
                }
            }
    
            await new Promise(resolve => setTimeout(resolve, 500));
            setShowLoading(false);

            setEtaList(newEtaList);
            setSuggestList({});

            setDownloadTrigger((prevKey) => prevKey + 1);
        }
    }

    useEffect(() => {
        downloadETA();
    },[downloadTrigger])

    async function downloadETA() {
        if (etaList.length > 0)
        {
            for (var i=0 ; i<etaList.length ; i++)
            {
                var currItem = etaList[i];
                var company = etaList[i]['company'];

                if (company == 'kmb')
                {
                    const url = `https://data.etabus.gov.hk/v1/transport/kmb/eta/${currItem['stop']}/${currItem['route']}/${currItem['service_type']}`;
                    const response = await axios.get(url);
                    const resultArray = extractKmbEta(response.data);
                    etaList[i]['eta1'] = resultArray[0];
                    etaList[i]['eta2'] = resultArray[1];
                    etaList[i]['eta3'] = resultArray[2];

                    console.log(resultArray);
                    updateElementByIndex(i, etaList[i]);
                }
                else if (company == 'ctb')
                {

                }
                else if (company == 'kmbctb')
                {

                }
            }
        }
    }

    const updateElementByIndex = (index, newValue) => {
        setEtaList(prevArray => {
          const updatedArray = [...prevArray];
          updatedArray[index] = newValue;
          return updatedArray;
        });
      };

    const onChangeInputRoutes = async(letter) => {
        setEtaList([]);
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
                    setSuggestList({});
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
            setSuggestList({});
        }

        if (newInput.charAt(newInput.length - 1) == '/')
            setSuggestList({});

        setInputRoutes(newInput);
    }

    const onClickRouteSuggestion = (route) => {
        var currInput = inputRoutes;
        var currInputArray = currInput.split('/');
        var newInput = '';

        for(var i=0 ; i<currInputArray.length-1 ; i++)
        {
            newInput += currInputArray[i] + '/';
        }

        newInput += route + '/';
        setInputRoutes(newInput);
        setSuggestList({});
    }

    const loadJson = async() => {
        try 
        {
            const response1 = await fetch(`${process.env.PUBLIC_URL}/json/unique/FINAL_unique_route_list.json`);
            const data1 = await response1.json();
            setRotueList(data1);

            const response3 = await fetch(`${process.env.PUBLIC_URL}/json/location/FINAL_location_based.json`);
            const data3 = await response3.json();
            setLocationBasedList(data3);

            const response4 = await fetch(`${process.env.PUBLIC_URL}/json/kmb/FINAL_route_stop_list.json`);
            const data4 = await response4.json();

            const response5 = await fetch(`${process.env.PUBLIC_URL}/json/ctb/FINAL_route_stop_list.json`);
            const data5 = await response5.json();

            const data6 = { ...data4, ...data5 };
            setRouteStopList(data6);
        } 
        catch (error)  { console.error('Error fetching JSON:', error); }
    }

    const showToastAlert = (text) => {
        if (activeTimeout != '')
            clearTimeout(activeTimeout);

        setToastText(text);
        setShowToast(true);

        const timeoutID = setTimeout(() => {
            setShowToast(false);
        }, 2000)
        setActiveTimeout(timeoutID);
    }

    useState(() => {
        getLocation(gettingLocationRef, showToastAlert, locationRef);
        setTimeout(async () => {
            await loadJson();
            setShowLoading(false);
                setTimeout(() => {
                    setShowContent(true);
                },300);
        },  500)
    },[]);

    return (
        <div className={styles.body}>

            {/* ===== LOADING SPINNER ===== */}
            <div style={{ width: '100%', height: '100%', position: 'fixed', display: showLoading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center' }}>
                <Fade in={showLoading} appear={true} style={{transitionDuration: '0.3s', width: '120px', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', border: '1px solid #dee2e6', backgroundColor: '#fbfbfb' }}>
                    <div><Spinner animation="border" size="lg" variant="primary" style={{margin:'auto', width:'60px', height: '60px', borderWidth: '6px'}}/></div>   
                </Fade>
            </div>
            

            {/* ===== TOAST ===== */}
            <Toast show={showToast} style={{display:showToast ? 'block':'none', position:'fixed', top:'10px', right:'10px'}} >
                <Toast.Header closeButton={false}><strong className="me-auto">Alert</strong></Toast.Header>
                <Toast.Body>{toastText}</Toast.Body>
            </Toast>

            {/* ===== MAIN CONTENT ===== */}
            <div style={{height:'100vh'}}>

                {/* ===== APP BAR ===== */}
                <div style={{height:'60px'}}>
                    <AppBar leftIcon={''} Header={quickSearch[lang]} rightIcon={''}></AppBar>
                </div>

                <Fade in={showContent} appear={true} style={{transitionDuration: '0.3s'}}>
                    <div style={{height:'calc(100vh - 60px)'}}>

                        {/* ===== ROUTE INPUT ===== */}
                        <div style={{height:'60px', display:'flex', direction:'column', alignContent:'center', padding:'5px'}}>
                            <Form.Control type="text" value={inputRoutes} placeholder={enterMultipleRoutes[lang]} readOnly={true}/>
                        </div>

                        {/* ===== MAIN COUTE CONTENT ===== */}
                        <div style={{height:'calc(100vh - 60px - 60px - 248px)', padding:'5px', overflowY:'hidden', 
                            display:'block', flexDirection:'row', justifyContent:'flex-start', flexWrap:'wrap',
                            overflow: 'auto', scrollbarWidth: 'none',}}>

                            {suggestList.length > 0 && suggestList.map((item, index) => (
                                <Fade in={true} appear={true} >
                                    <div style={{height:'60px', width:'25%', display:'inline-block', textAlign:'center', lineHeight:'52px'}}>
                                        <div style={{margin:'4px', height:'52px', backgroundColor:'#F4F4F4'}} onClick={() => onClickRouteSuggestion(item)}>{item}</div>
                                    </div>
                                </Fade>
                            ))}

                            {etaList.length > 0 && etaList.map((item, index) => (
                                <Fade in={true} appear={true} >
                                    <div style={{height:'74px', width:'100%', display:'block', textAlign:'center', lineHeight:'66px'}}>
                                        <div style={{margin:'2px', height:'66px', backgroundColor:'#F4F4F4', display:'flex', flexDirection:'row'}} >

                                            <div style={{width:'15%', fontSize:'18px'}}>{item['route']}</div>
                                            <div style={{width:'65%', lineHeight:'30px', textAlign:'left', margin:'4px'}}>
                                                <div style={{display:'flex', flexDirection:'row', height:'50%', alignItems: 'flex-end'}}>
                                                    <div style={{fontSize:'13px', marginTop: 'auto'}}>{to[lang]}&nbsp;</div>
                                                    <div style={{fontSize:'16px'}}>{item['dest_tc']}</div>
                                                </div>
                                                <div style={{height:'50%', fontSize:'16px'}}>{item['name_tc']}</div>
                                            </div>
                                            <div style={{width:'20%', lineHeight:'20px'}}>
                                                <div style={{display:'flex', flexDirection:'row', height:'33%'}}>
                                                    <div style={{width:'50%', textAlign:'right'}}>{item['eta1']}&nbsp;</div>
                                                    <div style={{width:'50%', textAlign:'left', fontSize:'13px', marginTop: 'auto'}}>{minute[lang]}</div>
                                                </div>
                                                <div style={{display:'flex', flexDirection:'row', height:'33%'}}>
                                                    <div style={{width:'50%', textAlign:'right'}}>{item['eta2']}&nbsp;</div>
                                                    <div style={{width:'50%', textAlign:'left', fontSize:'13px', marginTop: 'auto'}}>{minute[lang]}</div>
                                                </div>
                                                <div style={{display:'flex', flexDirection:'row', height:'33%'}}>
                                                    <div style={{width:'50%', textAlign:'right'}}>{item['eta3']}&nbsp;</div>
                                                    <div style={{width:'50%', textAlign:'left', fontSize:'13px', marginTop: 'auto'}}>{minute[lang]}</div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </Fade>
                            ))}

                        </div>

                        {/* ===== NUM PAD ===== */}
                        <div style={{height:'248px', borderTop:'1px solid #e2e2e2'}}>
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
                                        <Button variant="danger" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('clear')}><Icon.Trash style={{padding:'0px !important',margin:'0px !important'}}/></Button>
                                        <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('backspace')}><Icon.Backspace/></Button>
                                        <Button variant="light" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('0')}>0</Button>
                                        <Button variant="primary" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('/')}>/</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onClickSearch()}><Icon.Search/></Button>
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
                    </div>
                </Fade>
            </div>
        </div>
    )
}

export default QuickSearch;