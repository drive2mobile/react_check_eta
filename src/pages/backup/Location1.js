import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const Location1 = () => {
    const[location, setLocation] = useState([]);
    const[timeNeeded, setTimeNeeded] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [finishTime, setFinishTime] = useState(null);

    const getLocation = async(highAccuracy, timeOut_in) => {
        return new Promise((resolve, reject) => {
            if (navigator.permissions) {

                navigator.permissions.query({ name: 'geolocation' }).then(result => {
                    if (result.state === 'granted' || result.state === 'prompt') 
                    {
                        const options = { enableHighAccuracy: highAccuracy, timeout: timeOut_in, maximumAge: 0};

                        navigator.geolocation.getCurrentPosition((position) => {
                        resolve([position.coords.latitude.toString(), position.coords.longitude.toString()]);
                        },error => {
                                console.log('Error retrieving location:', error);
                                resolve([]);
                        }, options);
                    }
                    else 
                    {
                        
                        resolve([]);
                    }
                });
            }
            else 
            {
                
                resolve([]);
            }
        })
    }

    const onClick = async() => {
        var startTime = performance.now();
        // await new Promise(resolve => setTimeout(resolve, 5000));

        var loc = await getLocation();
        setLocation(loc);

        var finishTime = performance.now();
        const timeDifference =  (finishTime - startTime) / 1000;
        setTimeNeeded(timeDifference);
    }


    return (
        <div>
            <h1></h1>
            <Button onClick={()=> {onClick(false, 5000)}}>Get Location [False/5000]</Button><br/>
            <Button onClick={()=> {onClick(false, 1000)}}>Get Location [False/1000]</Button><br/>
            <Button onClick={() => {onClick(true, 5000)}}>Get Location [True/5000]</Button><br/>
            <Button onClick={() => {onClick(true, 1000)}}>Get Location [True/1000]</Button><br/>
            <p>{location}</p>
            {timeNeeded}
        </div>
    )
}

export default Location1;