import { useEffect, useState } from "react";

function scheduleTimer(autoDownload, downloadETA, etaList, setEtaList, setToastText, setToastTrigger, setTimer) {
    let timer = null;

    if (autoDownload) {
        timer = setInterval(() => {
            downloadETA(etaList, setEtaList, setToastText, setToastTrigger);
        }, 1000*30);
        
        setTimer(timer);
    } else if (autoDownload === false) {
        if (timer) {
            clearInterval(timer);
            setTimer(null);
        }
    }

    return () => {
        if (timer) {
            clearInterval(timer);
            setTimer(null);
        }
    };
}

export { scheduleTimer };