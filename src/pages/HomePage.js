import { Button, Fade } from 'react-bootstrap';
import styles from './styles/HomePageStyle.module.css';
import * as ReactIcon from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { hostURL } from '../utilities/Constant';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.body}>
            <Fade in={true} appear={true} style={{transitionDuration: '0.8s'}}>
                <div style={{height:'100dvh'}}>
                    <div style={{ height: 'calc(100dvh - 100px - 200px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '25px', textAlign: 'center' }}>
                        <div>
                            <img src={`${hostURL}/picture/logo_large.png`} style={{ width: '50%', height: 'auto', padding: '0px', border: '0px solid black', borderRadius: '15px' }} />
                        </div>
                        <div>
                            香港巴士到站查詢
                        </div>
                    </div>

                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        開始使用時，<b>請允許</b>瀏覽器使用你的位置
                    </div>

                    <div style={{height:'200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Button variant="light" size='lg' style={{width:'26%', height:'120px'}} onClick={() => navigate('/quicksearch')}>
                            <div >
                                <ReactIcon.Magic style={{width:'55px', height:'55px', marginBottom:'10px', marginRight:'7.5%'}}/>
                                <div>快速搜尋</div>
                            </div>
                        </Button>

                        <Button variant="light" size='lg' style={{width:'26%', height:'120px', marginLeft:'7.5%'}} onClick={() => navigate('/generalsearch')}>
                            <div >
                                <ReactIcon.Search style={{width:'55px', height:'55px', marginBottom:'10px'}}/>
                                <div>一般搜尋</div>
                            </div>
                        </Button>

                        <Button variant="light" size='lg' style={{width:'26%', height:'120px', marginLeft:'7.5%'}} onClick={() => navigate('/downloaddata')}>
                            <div >
                                <ReactIcon.Download style={{width:'55px', height:'55px', marginBottom:'10px'}}/>
                                <div>下載資料</div>
                            </div>
                        </Button>
                    </div>
                </div>
            </Fade>
        </div>
    )
}

export default HomePage;