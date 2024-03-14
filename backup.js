import AppBar from '../ui_components/AppBar';
import styles from './QuickSearchStyle.module.css';
import { useState, useEffect } from 'react';
import { Form, Accordion, Button, ListGroup, Row, Col, Fade, Spinner, Toast, Container } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const QuickSearch = () => {
    const[showLoading, setShowLoading] = useState(true);
    const[showContent, setShowContent] = useState(false);
    const[inputRoutes, setInputRoutes] = useState('');

    const onChangeInputRoutes = (letter) => {
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

        setInputRoutes(newInput);
    }

    useState(() => {
        setTimeout(() => {
            setShowLoading(false);
            setTimeout(() => {
                setShowContent(true);
            },300);
        }, 300)
    },[]);

    return (
        <div className={styles.body}>
            <Fade in={showLoading} appear={true} style={{transitionDuration: '0.3s', width:'120px', height:'120px', display: showLoading ? 'flex' : 'none', direction:'column', alignContent:'center', border:'1px solid #dee2e6', borderRadius:'10px',
                position:'fixed', top:'calc(50% - 60px)', left:'calc(50% - 60px)',}}>
                <div><Spinner animation="border" size="lg" variant="primary" style={{margin:'auto', width:'60px', height: '60px', borderWidth: '6px'}}/></div>   
            </Fade>

            <div style={{height:'8%'}}>
                <AppBar leftIcon={''} Header={'Test'} rightIcon={''}></AppBar>
            </div>

            <div style={{height:'92%',display:'flex',flexDirection:'column'}}>
                <Fade in={showContent} appear={true} style={{transitionDuration: '0.3s'}}>
                    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
                        {/* <Form.Control type="text" value={inputRoutes} placeholder="Enter Route" readOnly={true}/> */}
                        
                        <div style={{height:'40%'}}>
                            aaa
                        </div>

                        <div style={{height:'60%'}}>
                            <div className={styles.row} >
                                <div style={{width:'70%'}}>
                                    <div className={styles.row}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('1')}>1</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('2')}>2</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('3')}>3</Button>
                                    </div>
                                    <div className={styles.row}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('4')}>4</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('5')}>5</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('6')}>6</Button>
                                    </div>
                                    <div className={styles.row}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('7')}>7</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('8')}>8</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('9')}>9</Button>
                                    </div>
                                    <div className={styles.row}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('clear')}><Icon.Trash/></Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('backspace')}><Icon.Backspace/></Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('0')}>0</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('/')}>/</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('search')}><Icon.Search/></Button>
                                    </div>
                                </div>

                                <div style={{width:'30%', overflowY:'auto', scrollbarWidth: 'none !important'}}>
                                    <div className={styles.row}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('1')}>1</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('2')}>2</Button>
                                    </div>
                                    <div className={styles.row}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('4')}>4</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('5')}>5</Button>
                                    </div>
                                    <div className={styles.row}>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('1')}>1</Button>
                                        <Button variant="success" size='lg' className={styles.numPadButton} onClick={() => onChangeInputRoutes('2')}>2</Button>
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