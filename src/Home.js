import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return(
        <div style={{width:'100%'}}>
            <h1 style={{textAlign:'center'}}>大布偶喵</h1>
            <img src={`${process.env.PUBLIC_URL}/picture/ragdoll1.jpg`} style={{width:'100%', height:'auto', padding:'10px', borderRadius:'10px'}}/>
            <Link to='/quicksearch'>QuickSearch</Link>
            <Link to='/timertest'>TimerTest</Link>
        </div>
    )
}

export default Home;