import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const MergeTSFiles = () => {
    const[triggerDLM3u8, setTriggerDLM3u8] = useState(false);
    const[triggerDLTs, setTriggerDLTs] = useState(false);
    const[triggerMerge, setTriggerMerge] = useState(false);

    const [tsFileUrls, setTsFileUrls] = useState([]);
    const [tsFiles, setTsFiles] = useState([]);
    const [totalDLCount, setTotalDLCount] = useState(null);
    const [currDLProgress, setCurrDLProgress] = useState(null);
   
    useEffect(() => {
        async function innerCall()
        {
            if (triggerDLM3u8)
            {
                await downloadM3u8AndParseTsUrl();
                setTriggerDLM3u8(false);
                setTriggerDLTs(true);
            }
        }
        innerCall();
    },[triggerDLM3u8])

    useEffect(() => {
        async function innerCall()
        {
            if (triggerDLTs)
            {
                await downloadTsFile();
                setTriggerDLTs(false);
                setTriggerMerge(true);
            }
        }
        innerCall();
    },[triggerDLTs])

    useEffect(() => {
        async function innerCall()
        {
            if (triggerMerge)
            {
                await mergeTSFiles();
                setTriggerMerge(false);
            }
        }
        innerCall();
    },[triggerMerge])
                
    async function downloadM3u8AndParseTsUrl()
    {
        const url = 'https://rthkaod2022.akamaized.net/m4a/radio/archive/radio1/12oclocknews/m4a/20240410.m4a/index_0_a.m3u8';
        const response = await axios.get(url);
        const content = response.data;

        var splitArray = content.toString().split('\n');
        var newTsFileUrls = [];

        for (var i=0 ; i<splitArray.length ; i++)
        {
            if (splitArray[i].substring(0, 7) == 'segment')
            {
                newTsFileUrls.push(splitArray[i]);
            }
        }

        setTsFileUrls(newTsFileUrls);
    }

    async function downloadTsFile()
    {
        setTotalDLCount(tsFileUrls.length);

        var newTsFile = [];
        for (var i=0 ; i<tsFileUrls.length ; i++)
        {
            const url1 = `https://rthkaod2022.akamaized.net/m4a/radio/archive/radio1/12oclocknews/m4a/20240410.m4a/${tsFileUrls[i]}`;
            const response1 = await axios.get(url1, { responseType: 'arraybuffer' });
            newTsFile.push(response1.data);
            setCurrDLProgress(i+1);

            await new Promise(resolve => setTimeout(resolve, 100));

            if (i==10)
                break;
        }
        setTsFiles(newTsFile);
    }

    async function mergeTSFiles()
    {
        try 
        {
            const mergedBlobParts = [];

            for (var i=0 ; i<tsFiles.length ; i++)
            {
                mergedBlobParts.push(new Blob([tsFiles[i]], { type: 'video/mp2t' }));
            }

            const mergedBlob = new Blob(mergedBlobParts, { type: 'video/mp2t' });
            const downloadUrl = URL.createObjectURL(mergedBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = 'file1.ts'; // Specify the desired file name
            downloadLink.click();
        } 
        catch (error) 
        {
            console.error('Error merging TS files:', error);
        }
    };

    return (
        <div>
            <img src={'/picture/ragdoll1.jpg'} style={{width:'50px', height:'auto'}}></img>
            <button onClick={() => {setTriggerDLM3u8(true)}}>Merge TS Files</button>

            {totalDLCount ? <div>Segment To DL: {totalDLCount}</div> : ''}
            {currDLProgress ? <div>DL Progress: {currDLProgress}</div> : ''}
             
        </div>
    );
}

export default MergeTSFiles;