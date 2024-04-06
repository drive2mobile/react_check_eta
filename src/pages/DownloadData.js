import { useEffect, useState } from "react"
import { downloadJson } from "../utilities/JsonHandler";
import { setStorageItemDB } from "../utilities/LocalStorage";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './DownloadDataStyle.module.css';
import ToastAlert from "../ui_components/ToastAlert";
import AppBar from "../ui_components/AppBar";
import { Form, Button, Fade } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { downloadComplete, downloadData, downloadingData } from "../utilities/Locale";
import ProgressBar from 'react-bootstrap/ProgressBar';

const DownloadData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const navigate = useNavigate();
    var backBtn = <Icon.ArrowLeft onClick={() => navigate('/', { replace: true })} style={{width:'50px', height:'50px', padding:'10px'}} />;
    const[lang, setLang] = useState('tc');
    const[downloadedItem, setDownloadedItem] = useState(0);
    const[progress, setProgress] = useState(0);
    const[mainText, setMainText] = useState(downloadingData[lang]);

    const[toastText, setToastText] = useState('');
    const[toastTrigger,setToastTrigger] = useState(0);

    useEffect(() => {
        initialize()
    }, [])

    async function initialize() {
        const timestamp = new Date().getTime();

        setDownloadedItem(1);
        const uniqueroutelistData = await downloadJson(`https://webappdev.info:8081/uniqueroutelist?timestamp=${timestamp}`);
        await setStorageItemDB('uniqueRouteList', uniqueroutelistData);
        setProgress(0);
        await new Promise(resolve => setTimeout(resolve, 500));

        setDownloadedItem(2);
        var kmbroutestoplistData = await downloadJson(`https://webappdev.info:8081/kmbroutestoplist?timestamp=${timestamp}`);
        setProgress(0);
        await new Promise(resolve => setTimeout(resolve, 500));

        setDownloadedItem(3);
        var ctbroutestoplistData = await downloadJson(`https://webappdev.info:8081/ctbroutestoplist?timestamp=${timestamp}`);
        var routeStopListData = {...kmbroutestoplistData, ...ctbroutestoplistData};
        await setStorageItemDB('routeStopList', routeStopListData);

        setDownloadedItem(4);
        var kmboutelistData = await downloadJson(`https://webappdev.info:8081/kmbroutelist?timestamp=${timestamp}`);
        setProgress(0);
        await new Promise(resolve => setTimeout(resolve, 500));

        setDownloadedItem(5);
        var ctbroutelistData = await downloadJson(`https://webappdev.info:8081/ctbroutelist?timestamp=${timestamp}`);
        setProgress(0);
        await new Promise(resolve => setTimeout(resolve, 500));
        var routeListData = {...kmboutelistData, ...ctbroutelistData};
        await setStorageItemDB('routeList', routeListData);

        setMainText(downloadComplete[lang]);
        setToastText(downloadComplete[lang]);
        setToastTrigger(prev => prev+1);

        await new Promise(resolve => setTimeout(resolve, 1000));
        if (urlParams.has('prevpage'))
        {
            const prevPage = urlParams.get('prevpage');
            if (prevPage == 'quicksearch')
            {
                navigate(`/${prevPage}`, {replace: true});
            }
            if (prevPage == 'generalsearch')
            {
                navigate(`/${prevPage}`, {replace: true});
            }
            else if (prevPage == 'routedetails')
            {
                const routeid = urlParams.get('routeid');
                const seq = urlParams.get('seq');
                navigate(`/${prevPage}?routeid=${routeid}&seq=${seq}`, {replace: true});
            }
        }
    }

    async function downloadJson(url_in)
    {
        try
        {
            const response = await axios.get(url_in, {
                responseType: 'json',
                onDownloadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setProgress(progress);
                },
            });
    
            const data = response.data;
            return data;
        }
        catch(error)
        {
            return {};
        }
    }

    return (
        <div className={styles.body}>
            {/* ===== TOAST ===== */}
            <ToastAlert toastText={toastText} toastTrigger={toastTrigger}/>

            {/* ===== MAIN CONTENT ===== */}
            <div style={{height:'100dvh'}}>

                {/* ===== APP BAR ===== */}
                <AppBar leftIcon={backBtn} Header={downloadData[lang]} rightIcon={''}></AppBar>

                <Fade in={true} appear={true} style={{transitionDuration: '0.8s'}}>
                    <div style={{height:'100dvh'}}>
                        <div style={{ height: 'calc(100dvh - 50px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '18px', textAlign: 'center' }}>
                            <div><Icon.Download style={{ width:'70px', height:'70px', padding: '0px'}} /></div>

                            <div style={{marginTop:'40px'}}>{mainText}</div>

                            <div>{downloadedItem}/5</div>

                            <ProgressBar variant="success" now={progress} style={{width:'50%'}} /> 
                        </div>
                    </div>
                </Fade>
            </div>
        </div>
    )
}

export default DownloadData