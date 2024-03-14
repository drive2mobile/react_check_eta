import AppBar from '../ui_components/AppBar';
import styles from './QuickSearchStyle.module.css';
import { useState, useEffect } from 'react';
import { Form, Button, Fade, Spinner } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const QuickSearch = () => {
    const[showLoading, setShowLoading] = useState(true);
    const[showContent, setShowContent] = useState(false);
    const[inputRoutes, setInputRoutes] = useState('');
    const[routeList, setRotueList] = useState({});
    const[suggestList, setSuggestList] = useState({});
    const[etaList, setEtaList] = useState({});

    const onClickSearch = async() => {
        var newEtaList = {107:{'route':'107', 'eta':'5'}, 108:{'route':'108', 'eta':'5'}};
        setEtaList(newEtaList);
        setSuggestList({});
    }

    const onChangeInputRoutes = (letter) => {
        setEtaList({});
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
            var newInputArray = newInput.split('/');
            var newInputMap = {};

            if (newInputArray.length >= 2)
            {
                for (var i=0 ; i<newInputArray.length-1 ; i++)
                {
                    newInputMap[newInputArray[i]] = newInputArray[i];
                }
            }
            
            if (newInputArray.length > 0)
            {
                var lastInput = newInputArray[newInputArray.length-1];
                if (lastInput != '')
                {
                    var newSuggestList = [];
                    for (const key in routeList)
                    {
                        const currRoute = routeList[key]['route'];
                        if (currRoute in newInputMap == false)
                        {
                            if (currRoute.substring(0, lastInput.length) == lastInput)
                                newSuggestList.push(currRoute);
                        }
                    }
                    setSuggestList(newSuggestList);

                    if (newSuggestList.length < 3)
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

    const loadRoutList = async() => {
        try 
        {
            const response1 = await fetch('/json/kmb/FINAL_route_list.json');
            const data1 = await response1.json();

            const response2 = await fetch('/json/ctb/FINAL_route_list.json');
            const data2 = await response2.json();

            const data = { ...data1, ...data2 };
            setRotueList(data);
        } 
        catch (error)  { console.error('Error fetching JSON:', error); }
    }

    useState(() => {
        setTimeout(async () => {
            await loadRoutList();
            setShowLoading(false);
                setTimeout(() => {
                    setShowContent(true);
                },300);
        }, 500)
    },[]);

    return (
        <div className={styles.body}>
            <Fade in={showLoading} appear={true} style={{transitionDuration: '0.3s', width:'120px', height:'120px', display: showLoading ? 'flex' : 'none', direction:'column', alignContent:'center', border:'1px solid #dee2e6', borderRadius:'10px',
                position:'fixed', top:'calc(50% - 60px)', left:'calc(50% - 60px)',}}>
                <div><Spinner animation="border" size="lg" variant="primary" style={{margin:'auto', width:'60px', height: '60px', borderWidth: '6px'}}/></div>   
            </Fade>

            <div style={{height:'100vh'}}>
                <div style={{height:'60px'}}>
                    <AppBar leftIcon={''} Header={'Test'} rightIcon={''}></AppBar>
                </div>

                <Fade in={showContent} appear={true} style={{transitionDuration: '0.3s'}}>
                    <div style={{height:'calc(100vh - 60px)'}}>

                        {/* ===== APP BAR ===== */}
                        <div style={{height:'60px', display:'flex', direction:'column', alignContent:'center', padding:'5px'}}>
                            <Form.Control type="text" value={inputRoutes} placeholder="Enter Route" readOnly={true}/>
                        </div>

                        {/* ===== MAIN COUTE CONTENT ===== */}
                        <div style={{height:'calc(100vh - 60px - 60px - 280px)', padding:'5px', overflowY:'hidden', 
                            display:'block', flexDirection:'row', justifyContent:'flex-start', flexWrap:'wrap',
                            overflow: 'auto', scrollbarWidth: 'none',}}>

                            {suggestList.length > 0 && suggestList.map((item, index) => (
                                <div style={{height:'54px', width:'25%', display:'inline-block', textAlign:'center', lineHeight:'46px'}}>
                                    <div style={{margin:'4px', height:'46px', backgroundColor:'#EFEFEF'}} onClick={() => onClickRouteSuggestion(item)}>{item}</div>
                                </div>
                            ))}

                            {Object.keys(etaList).length > 0 && Object.keys(etaList).map((key) => (
                                <div style={{height:'54px', width:'100%', display:'block', textAlign:'center', lineHeight:'46px'}}>
                                    <div style={{margin:'4px', height:'46px', backgroundColor:'#EFEFEF'}} onClick={() => onClickRouteSuggestion(etaList[key]['route'])}>{etaList[key]['route']}</div>
                                </div>
                            ))}

                        </div>

                        {/* ===== NUM PAD ===== */}
                        <div style={{height:'280px'}}>
                            <div className={styles.row} >
                                <div style={{width:'70%', paddingLeft:'2px', paddingRight:'1px'}}>
                                    <div className={styles.row} style={{height:'69px', padding:'2px'}}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('1')}>1</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('2')}>2</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('3')}>3</Button>
                                    </div>
                                    <div className={styles.row} style={{height:'69px', padding:'2px'}}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('4')}>4</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('5')}>5</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('6')}>6</Button>
                                    </div>
                                    <div className={styles.row} style={{height:'69px', padding:'2px'}}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('7')}>7</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('8')}>8</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('9')}>9</Button>
                                    </div>
                                    <div className={styles.row} style={{height:'69px', padding:'2px'}}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('clear')}><Icon.Trash style={{padding:'0px !important',margin:'0px !important'}}/></Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('backspace')}><Icon.Backspace/></Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('0')}>0</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('/')}>/</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onClickSearch()}><Icon.Search/></Button>
                                    </div>
                                </div>

                                <div style={{width:'30%',height:'280px', paddingLeft:'1px', paddingRight:'2px', overflowY:'auto', scrollbarWidth: 'none', paddingBottom:'4px'}}>
                                    <div className={styles.row} style={{height:'69px', padding:'2px'}}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('X')}>X</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('A')}>A</Button>
                                    </div>
                                    <div className={styles.row} style={{height:'69px', padding:'2px'}}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('B')}>B</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('C')}>C</Button>
                                    </div>
                                    <div className={styles.row} style={{height:'69px', padding:'2px'}}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('D')}>D</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('E')}>E</Button>
                                    </div>
                                    <div className={styles.row} style={{height:'69px', padding:'2px'}}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('F')}>F</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('H')}>H</Button>
                                    </div>
                                    <div className={styles.row} style={{height:'69px', padding:'2px'}}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('K')}>K</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('M')}>M</Button>
                                    </div>
                                    <div className={styles.row} style={{height:'69px', padding:'2px'}}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('N')}>N</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('P')}>P</Button>
                                    </div>
                                    <div className={styles.row} style={{height:'69px', padding:'2px'}}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('R')}>R</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('S')}>S</Button>
                                    </div>
                                    <div className={styles.row} style={{height:'69px', padding:'2px'}}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('U')}>U</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('W')}>W</Button>
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