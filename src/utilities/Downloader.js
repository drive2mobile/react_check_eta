import axios from "axios";
import { extractCtbEta, extractKmbEta, sortCoopEta } from "./JsonHandler";
import { unableToDownloadETA } from "./Locale";

async function downloadJson(url, setShowLoading, setToastText, setToastTrigger){
    return new Promise(async (resolve, reject) => {
        try{
            setShowLoading(true);
            // await new Promise(resolve => setTimeout(resolve, 2000));
            const response = await fetch(url);
            const data = await response.json();
            setShowLoading(false);
            resolve(data);
        }
        catch(error)
        {
            setToastText('Error');
            setToastTrigger((prev) => prev+1);
            setShowLoading(false);
            resolve({});
        }
    })
}

async function downloadETA(etaList_in, setEtaList_in, setToastText_in, setToastTrigger_in, lang_in)
{
    const updateElementByIndex = (index, newValue) => {
        setEtaList_in(prevArray => {
          const updatedArray = [...prevArray];
          updatedArray[index] = newValue;
          return updatedArray;
        });
    };

    if (etaList_in.length > 0)
    {
        try
        {
            for (var i=0 ; i<etaList_in.length ; i++)
            {
                var currItem = etaList_in[i];
                var company = etaList_in[i]['company'];

                if (company == 'kmb')
                {
                    const url = `https://data.etabus.gov.hk/v1/transport/kmb/eta/${currItem['stop']}/${currItem['route']}/1`;
                    const response = await axios.get(url);
                    const resultArray = extractKmbEta(response.data, etaList_in[i]['direction']);
                    etaList_in[i]['eta1'] = resultArray[0];
                    etaList_in[i]['eta2'] = resultArray[1];
                    etaList_in[i]['eta3'] = resultArray[2];
                }
                else if (company == 'ctb')
                {
                    const url = `https://rt.data.gov.hk/v2/transport/citybus/eta/ctb/${currItem['stop']}/${currItem['route']}`;
                    const response = await axios.get(url);
                    const resultArray = extractCtbEta(response.data, etaList_in[i]['direction']);
                    etaList_in[i]['eta1'] = resultArray[0];
                    etaList_in[i]['eta2'] = resultArray[1];
                    etaList_in[i]['eta3'] = resultArray[2];
                }
                else if (company == 'kmbctb')
                {
                    const urlKmb = `https://data.etabus.gov.hk/v1/transport/kmb/eta/${currItem['stop']}/${currItem['route']}/1`;
                    const responseKmb = await axios.get(urlKmb);
                    const resultArrayKmb = extractKmbEta(responseKmb.data, etaList_in[i]['direction']);

                    const urlCtb = `https://rt.data.gov.hk/v2/transport/citybus/eta/ctb/${currItem['coopStop']}/${currItem['route']}`;
                    const responseCtb = await axios.get(urlCtb);
                    const resultArrayCtb = extractCtbEta(responseCtb.data, etaList_in[i]['coopDir']);

                    const combinedArray = [...resultArrayKmb, ...resultArrayCtb];
                    const resultArray = sortCoopEta(combinedArray);

                    etaList_in[i]['eta1'] = resultArray[0];
                    etaList_in[i]['eta2'] = resultArray[1];
                    etaList_in[i]['eta3'] = resultArray[2];
                }
                updateElementByIndex(i, etaList_in[i]);
            }
        }
        catch(error)
        {
            setToastText_in(unableToDownloadETA[lang_in]);
            setToastTrigger_in((prev) => prev+1);
        }
    }


}



export { downloadJson, downloadETA }