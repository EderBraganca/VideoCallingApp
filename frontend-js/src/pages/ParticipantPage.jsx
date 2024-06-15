import React, { useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://192.168.2.6:5000');

export const ParticipantPage = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const joinCall = () => {
        console.log('Joining call as', name);
        socket.emit('join-call', name);

        socket.on('allowed-to-join', () => {
            navigate('/call');
        });

    };

    return (
        <div>
            <h2>Waiting for host</h2>
            <section className='inputSection'>
                <input className="nameInput"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                <button onClick={joinCall}>Join</button>
            </section>
        </div>
    );
};