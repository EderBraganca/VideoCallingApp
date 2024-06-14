import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export const Host: React.FC = () => {
    const [waitingList, setWaitingList] = useState<string[]>([]);

    useEffect(() => {
        socket.on('waiting-list', (list: string[]) => {
            setWaitingList(list);
        });
    }, []);

    const allowParticipant = (participantId: string) => {
        socket.emit('allow-participant', participantId);
    };

    return (
        <div>
            <h2>Host Page</h2>
            <h3>Waiting Participants</h3>
            <ul>
                {waitingList.map(participantId => (
                    <li key={participantId}>
                        {participantId} <button onClick={() => allowParticipant(participantId)}>Allow</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};