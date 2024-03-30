import moment from 'moment';

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

function extractKmbEta(jsonData, direction)
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

function extractCtbEta(jsonData, direction) 
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

function sortCoopEta(etaArray)
{
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

function calculateCoundDown(timestamp)
{
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

export { extractKmbEta, extractCtbEta, sortCoopEta, downloadJson }