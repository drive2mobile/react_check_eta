import moment from 'moment';

const extractKmbEta = (jsonData) => 
{
    var dataArray = jsonData['data'];
    var etaArray = ['-', '-', '-'];

    try
    {
        for (var i=0 ; i<dataArray.length ; i++)
        {
            if (dataArray[i]['eta_seq'] == '1')
            {
                etaArray[0] = calculateCoundDown(dataArray[i]['eta']);
            }
            else if (dataArray[i]['eta_seq'] == '2')
            {
                etaArray[1] = calculateCoundDown(dataArray[i]['eta']);
            }
            else if (dataArray[i]['eta_seq'] == '3')
            {
                etaArray[2] = calculateCoundDown(dataArray[i]['eta']);
            }
        }
    }
    catch{}

    return etaArray;
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

export { extractKmbEta }