import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('https://192.168.2.6:5000');

export const ParticipantPage = () => {
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('joinAccepted', (room) => {
            setMessage(`You have joined the room: ${room}`);
            navigate(`/call?room=${room}`);
        });

        return () => {
            socket.off('joinAccepted');
        };
    }, [navigate]);

    const joinRoom = () => {
        socket.emit('requestJoin', room);
    };

    return (
        <div>
            <h1>Join Room</h1>
            <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room ID" />
            <button onClick={joinRoom}>Join Room</button>
            <p>{message}</p>
        </div>
    );
};