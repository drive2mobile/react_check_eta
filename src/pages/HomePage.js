import { Button, Fade } from 'react-bootstrap';
import styles from './HomePageStyle.module.css';
import * as ReactIcon from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ragdoll1 from "../images/ragdoll1.jpg";

const HomePage = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    // `${process.env.PUBLIC_URL}/picture/ragdoll1.jpg`
    return (
        <div className={styles.body}>
            <Fade in={true} appear={true} style={{transitionDuration: '0.8s'}}>
                <div style={{height:'100dvh'}}>
                    <div style={{ height: 'calc(100dvh - 100px - 200px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '25px', textAlign: 'center' }}>
                        <div>
                            <img src={`https://webappdev.info/checketatest/picture/ragdoll1.jpg`} style={{ width: '50%', height: 'auto', padding: '0px', border: '0px solid black', borderRadius: '15px' }} />
                        </div>
                        <div>
                            香港巴士到站查詢
                        </div>
                    </div>

                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        開始使用時，<b>請允許</b>瀏覽器使用你的位置
                    </div>

                    <div style={{height:'200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Button variant="light" size='lg' style={{width:'40%', height:'150px'}} onClick={() => navigate('/quicksearch')}>
                            <div >
                                <ReactIcon.Magic style={{width:'70px', height:'70px', marginBottom:'10px', marginRight:'7.5%'}}/>
                                <div>快速搜尋</div>
                            </div>
                        </Button>

                        <Button variant="light" size='lg' style={{width:'40%', height:'150px', marginLeft:'7.5%'}}>
                            <div >
                                <ReactIcon.Search style={{width:'70px', height:'70px', marginBottom:'10px'}}/>
                                <div>一般搜尋(準備中)</div>
                            </div>
                        </Button>
                    </div>
                </div>
            </Fade>
        </div>
    )
}

export default HomePage;