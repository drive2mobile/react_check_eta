import moment from 'moment';
import { findClosestStop } from './LocationUtility';
import { pleaseInputRoutes } from './Locale';

async function buildEtaList(inputRoutes_in, navigate_in, setShowLoading_in, urlParams_in, locationRef_in, routeStopList_in, setToastText_in, setToastTrigger_in, lang_in)
{
    return new Promise(async (resolve, reject) => {
        if (inputRoutes_in != '')
        { 
            setShowLoading_in(true);

            urlParams_in.set('query', inputRoutes_in);
            navigate_in('?' + urlParams_in.toString());

            while(locationRef_in.length == 0)
            {
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            var newEtaList = [];
            var inputRoutesArray = inputRoutes_in.split('/');

            for (var i=0 ; i<inputRoutesArray.length ; i++)
            {
                var currRouteIdArray = ['kmb' + inputRoutesArray[i] + '_I1','kmb' + inputRoutesArray[i] + '_O1',
                                        'ctb' + inputRoutesArray[i] + '_I1','ctb' + inputRoutesArray[i] + '_O1',
                                        'kmbctb' + inputRoutesArray[i] + '_I1','kmbctb' + inputRoutesArray[i] + '_O1',];
    
                for (var j=0 ; j<currRouteIdArray.length ; j++)
                {
                    if (currRouteIdArray[j] in routeStopList_in)
                    {
                        var closestStop = findClosestStop(locationRef_in[0], locationRef_in[1], routeStopList_in[currRouteIdArray[j]]);

                        if (closestStop != null) 
                        {
                            closestStop['eta1'] = '-';
                            closestStop['eta2'] = '-';
                            closestStop['eta3'] = '-';
                            newEtaList.push(closestStop);
                        }
                            
                    }  
                }
            }
            setShowLoading_in(false);
            resolve(newEtaList);
        }
        else
        {
            resolve([]);
            setToastTrigger_in((prev) => prev+1);
            setToastText_in(pleaseInputRoutes[lang_in]);
        }
    })
}

const extractKmbEta = (jsonData, direction) => 
{
    var dataArray = jsonData['data'];
    var etaArray = ['-', '-', '-'];

    try
    {
        for (var i=0 ; i<dataArray.length ; i++)
        {
            if (dataArray[i]['eta_seq'] == '1' && dataArray[i]['dir'] == direction)
            {
                etaArray[0] = calculateCoundDown(dataArray[i]['eta']);
            }
            else if (dataArray[i]['eta_seq'] == '2' && dataArray[i]['dir'] == direction)
            {
                etaArray[1] = calculateCoundDown(dataArray[i]['eta']);
            }
            else if (dataArray[i]['eta_seq'] == '3' && dataArray[i]['dir'] == direction)
            {
                etaArray[2] = calculateCoundDown(dataArray[i]['eta']);
            }
        }
    }
    catch{}

    return etaArray;
}

const extractCtbEta = (jsonData, direction) => 
{
    var dataArray = jsonData['data'];
    var etaArray = ['-', '-', '-'];

    try
    {
        for (var i=0 ; i<dataArray.length ; i++)
        {
            if (dataArray[i]['eta_seq'] == 1 && dataArray[i]['dir'] == direction)
            {
                etaArray[0] = calculateCoundDown(dataArray[i]['eta']);
            }
            else if (dataArray[i]['eta_seq'] == 2 && dataArray[i]['dir'] == direction)
            {
                etaArray[1] = calculateCoundDown(dataArray[i]['eta']);
            }
            else if (dataArray[i]['eta_seq'] == 3 && dataArray[i]['dir'] == direction)
            {
                etaArray[2] = calculateCoundDown(dataArray[i]['eta']);
            }
        }
    }
    catch{}

    return etaArray;
}

const sortCoopEta = (etaArray) => {
    var tempArray = [];
    var returnArray = [];

    for(var i=0 ; i<etaArray.length ; i++)
    {
        if (typeof etaArray[i] === 'number' && Number.isInteger(etaArray[i]))
        {
            tempArray.push(etaArray[i]);
        }
    }

    returnArray = tempArray.slice().sort((a, b) => a - b);

    while (returnArray.length < 3)
        returnArray.push('-');

    return returnArray;
}

function calculateCoundDown(timestamp){
    var difference = '-';

    try
    {
        const dateString = timestamp;
        const currentTime = moment();
        const targetTime = moment(dateString);
        const minuteDifference = targetTime.diff(currentTime, 'minutes');
        difference = minuteDifference >= 0 ? minuteDifference : -minuteDifference;
    }
    catch
    {
        difference = '-';
    }

    return difference;
}

export { extractKmbEta, extractCtbEta, sortCoopEta, buildEtaList }