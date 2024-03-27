import React, { useState, useEffect } from 'react';

const TimerTest = () => {
    const [dateTimeRecords, setDateTimeRecords] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => {
            const currentDateTime = new Date();
            setDateTimeRecords(prevRecords => [...prevRecords, currentDateTime]);
        }, 30000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div>
            <h1>Date and Time Records</h1>
            <ul>
                {dateTimeRecords.map((dateTime, index) => (
                    <li key={index}>{dateTime.toString()}</li>
                ))}
            </ul>
        </div>
    );
};

export default TimerTest;