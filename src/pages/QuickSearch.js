import AppBar from '../ui_components/AppBar';
import styles from './QuickSearchStyle.module.css';
import { useState, useEffect, useRef  } from 'react';
import { Form, Button, Fade, Spinner, Toast } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { getLocation, addInterval, minusInterval, roundDown, calculateDistance, findClosestStop } from '../utilities/LocationUtility';
import { ctb, enterMultipleRoutes, kmb, kmbctb, minute, quickSearch, to } from '../utilities/Locale';
import axios from 'axios';
import { extractCtbEta, extractKmbEta, sortCoopEta } from '../utilities/JsonExtract';
import SpinnerFullscreen from '../ui_components/SpinnerFullscreen';
import ToastAlert from '../ui_components/ToastAlert';

const QuickSearch = () => {
    const[lang, setLang] = useState('tc');

    const[showKeyboard, setShowKeyboard] = useState(true);

    const[showLoading, setShowLoading] = useState(true);
    const[showContent, setShowContent] = useState(false);

    const[toastText, setToastText] = useState('');
    const[toastTrigger,setToastTrigger] = useState(0);

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

            var location = [];
            location = await getLocation(setToastText, setToastTrigger, lang);

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
                        var closestStop = findClosestStop(location[0], location[1], routeStopList[currRouteIdArray[j]]);

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

            console.log(newEtaList);
            setEtaList(newEtaList);
            setSuggestList({});

            setDownloadTrigger((prevKey) => prevKey + 1);
        }
        else
        {
            setToastTrigger((prev) => prev+1);
            setToastText('Empty');
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
                    const url = `https://data.etabus.gov.hk/v1/transport/kmb/eta/${currItem['stop']}/${currItem['route']}/1`;
                    const response = await axios.get(url);
                    const resultArray = extractKmbEta(response.data, etaList[i]['direction']);
                    etaList[i]['eta1'] = resultArray[0];
                    etaList[i]['eta2'] = resultArray[1];
                    etaList[i]['eta3'] = resultArray[2];

                    // console.log(resultArray);
                    updateElementByIndex(i, etaList[i]);
                }
                else if (company == 'ctb')
                {
                    const url = `https://rt.data.gov.hk/v2/transport/citybus/eta/ctb/${currItem['stop']}/${currItem['route']}`;
                    const response = await axios.get(url);
                    const resultArray = extractCtbEta(response.data, etaList[i]['direction']);
                    etaList[i]['eta1'] = resultArray[0];
                    etaList[i]['eta2'] = resultArray[1];
                    etaList[i]['eta3'] = resultArray[2];

                    // console.log(resultArray);
                    updateElementByIndex(i, etaList[i]);
                }
                else if (company == 'kmbctb')
                {
                    const urlKmb = `https://data.etabus.gov.hk/v1/transport/kmb/eta/${currItem['stop']}/${currItem['route']}/1`;
                    const responseKmb = await axios.get(urlKmb);
                    const resultArrayKmb = extractKmbEta(responseKmb.data, etaList[i]['direction']);

                    const urlCtb = `https://rt.data.gov.hk/v2/transport/citybus/eta/ctb/${currItem['coopStop']}/${currItem['route']}`;
                    const responseCtb = await axios.get(urlCtb);
                    const resultArrayCtb = extractCtbEta(responseCtb.data, etaList[i]['coopDir']);

                    const combinedArray = [...resultArrayKmb, ...resultArrayCtb];
                    const resultArray = sortCoopEta(combinedArray);

                    etaList[i]['eta1'] = resultArray[0];
                    etaList[i]['eta2'] = resultArray[1];
                    etaList[i]['eta3'] = resultArray[2];

                    updateElementByIndex(i, etaList[i]);
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

    // axios.defaults.withCredentials = true;
    const loadJson = async() => {
        try 
        {
            // const response1 = await fetch(`${process.env.PUBLIC_URL}/json/unique/FINAL_unique_route_list.json`);

            const response1 = await fetch(`https://webappdev.info:8081/uniqueroutelist`);
            const data1 = await response1.json();
            setRotueList(data1);

            // const storageRouteList = sessionStorage.getItem('routeList');
            // if (storageRouteList)
            // {
            //     setRotueList(JSON.parse(storageRouteList));
            // }
            // else
            // {
            //     const response1 = await fetch(`${process.env.PUBLIC_URL}/json/unique/FINAL_unique_route_list.json`);
            //     const data1 = await response1.json();
            //     setRotueList(data1);
            //     sessionStorage.setItem('routeList', JSON.stringify(data1));
            // }

            // const response3 = await fetch(`${process.env.PUBLIC_URL}/json/location/FINAL_location_based.json`);
            // const data3 = await response3.json();
            // setLocationBasedList(data3);

            // const storageRouteStopList = sessionStorage.getItem('routeStopList');
            // if (storageRouteStopList)
            // {
            //     setRouteStopList(storageRouteStopList);
            //     console.log(storageRouteStopList);
            // }
            // else
            // {
            //     const response4 = await fetch(`${process.env.PUBLIC_URL}/json/kmb/FINAL_route_stop_list.json`);
            //     const data4 = await response4.json();
    
            //     const response5 = await fetch(`${process.env.PUBLIC_URL}/json/ctb/FINAL_route_stop_list.json`);
            //     const data5 = await response5.json();
    
            //     const data6 = { ...data4, ...data5 };
            //     setRouteStopList(data6);
            //     sessionStorage.setItem('routeStopList', JSON.stringify(data6));
            // }

            // const response4 = await fetch(`${process.env.PUBLIC_URL}/json/kmb/FINAL_route_stop_list.json`);

            const response4 = await fetch(`https://webappdev.info:8081/kmbroutestoplist`);
            const data4 = await response4.json();

            // const response5 = await fetch(`${process.env.PUBLIC_URL}/json/ctb/FINAL_route_stop_list.json`);
            const response5 = await fetch(`https://webappdev.info:8081/ctbroutestoplist`);
            const data5 = await response5.json();

            const data6 = { ...data4, ...data5 };
            setRouteStopList(data6);
        } 
        catch (error)  { console.error('Error fetching JSON:', error); }
    }

    useState(() => {
        getLocation(setToastText, setToastTrigger, lang);

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
            <SpinnerFullscreen showLoading={showLoading}/>

            {/* ===== TOAST ===== */}
            <ToastAlert toastText={toastText} toastTrigger={toastTrigger}/>

            {/* ===== MAIN CONTENT ===== */}
            <div style={{height:'100vh'}}>

                {/* ===== APP BAR ===== */}
                <AppBar leftIcon={''} Header={quickSearch[lang]} rightIcon={''}></AppBar>

                <Fade in={showContent} appear={true} style={{transitionDuration: '0.3s'}}>
                    <div style={{height:'calc(100vh - 50px)'}}>

                        {/* ===== ROUTE INPUT ===== */}
                        <div style={{height:'60px', display:'flex', direction:'column', alignContent:'center', padding:'5px'}}>
                            <Form.Control type="text" value={inputRoutes} placeholder={enterMultipleRoutes[lang]} readOnly={true}/>
                            <Button variant="light" onClick={() => onChangeInputRoutes('clear')}
                                style={{position:'fixed', right:'15px', top: '65px', textAlign:'center', height:'30px', width:'30px', borderRadius:'15px', padding:'0px'}} >
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

                            {suggestList.length > 0 && suggestList.map((item, index) => (
                                <Fade in={true} appear={true} >
                                    <div style={{height:'60px', width:'25%', display:'inline-block', textAlign:'center', lineHeight:'52px'}}>
                                        <div style={{margin:'4px', height:'52px', backgroundColor:'#F4F4F4'}} onClick={() => onClickRouteSuggestion(item)}>{item}</div>
                                    </div>
                                </Fade>
                            ))}

                            {etaList.length > 0 && etaList.map((item, index) => (
                                <Fade in={true} appear={true} >
                                    <div style={{height:'74px', width:'100%', display:'block', textAlign:'center'}}>

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
                            </Fade>
                        }
                        
                    </div>
                </Fade>
            </div>
        </div>
    )
}

export default QuickSearch;