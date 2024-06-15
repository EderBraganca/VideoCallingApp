import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://192.168.2.6:5000');

export const HostPage = () => {
    const [waitingList, setWaitingList] = useState();

    useEffect(() => {
        socket.on('waiting-list', (list) => {
            setWaitingList(list);
        });
    }, []);

    const allowParticipant = (participantId) => {
        socket.emit('allow-participant', participantId);
    };

    return (
        <div>
            <h2>Host Page</h2>
            <h3>Waiting Participants</h3>
            <ul>
                {waitingList && waitingList.map(participant => (
                    <li key={participant.id}>
                        {participant.name} ({participant.id})
                        <button onClick={() => allowParticipant(participant.id)}>Allow</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};