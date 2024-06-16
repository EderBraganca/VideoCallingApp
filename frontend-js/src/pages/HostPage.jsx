import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://192.168.2.6:5000');

export const HostPage = () => {
    const [room, setRoom] = useState('');
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        socket.on('joinRequest', (data) => {
            setRequests((prevRequests) => [...prevRequests, data]);
        });

        return () => {
            socket.off('joinRequest');
        };
    }, []);

    const createRoom = () => {
        socket.emit('createRoom', room);
    };

    const acceptRequest = (socketId) => {
        socket.emit('acceptJoin', { room, socketId });
        setRequests(requests.filter((request) => request.socketId !== socketId));
    };

    return (
        <div>
            <h1>Create Room</h1>
            <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room ID" />
            <button onClick={createRoom}>Create Room</button>
            <h2>Join Requests</h2>
            <ul>
                {requests.map((request, index) => (
                    <li key={index}>
                        {request.socketId} wants to join
                        <button onClick={() => acceptRequest(request.socketId)}>Accept</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};