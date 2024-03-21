import { Fade, Spinner } from "react-bootstrap";
import styles from './SpinnerFullscreen.module.css';

const SpinnerFullscreen = ({showLoading}) => {
    return (
        <div className={styles.container} style={{display: showLoading ? 'flex' : 'none'}}>
            <Fade in={showLoading} appear={true} className={styles.spinnerGrid}>
                <div>
                    <Spinner animation="border" size="lg" variant="primary" className={styles.spinner}/>
                </div>   
            </Fade>
        </div>
    );
}

export default SpinnerFullscreen;