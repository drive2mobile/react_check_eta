import { useEffect, useState } from "react";

function scheduleTimer(autoDownload, setDownloadTrigger, setTimer) {
    let timer = null;

    if (autoDownload) {
        timer = setInterval(() => {
            setDownloadTrigger(prevKey => prevKey + 1);
        }, 30000);
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