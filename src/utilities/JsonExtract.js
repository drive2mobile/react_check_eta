import moment from 'moment';

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

export { extractKmbEta, extractCtbEta, sortCoopEta }