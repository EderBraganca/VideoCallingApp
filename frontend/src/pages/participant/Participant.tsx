import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

export const Participant: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('join-call');

        socket.on('allowed-to-join', () => {
          navigate('/call');
        });
    }, [navigate]);

    return (
        <div>
            <h2>Waiting for host approval...</h2>
        </div>
    );
};