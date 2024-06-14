import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export const Call: React.FC = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        const init = async () => {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream;
            }
            peerConnection.current = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });

            localStream.getTracks().forEach(track => peerConnection.current?.addTrack(track, localStream));

            peerConnection.current.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit('candidate', { candidate: event.candidate });
                }
            };

            peerConnection.current.ontrack = event => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };

            socket.on('offer', async data => {
                await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await peerConnection.current?.createAnswer();
                await peerConnection.current?.setLocalDescription(answer);
                socket.emit('answer', { answer });
            });

            socket.on('candidate', async data => {
                await peerConnection.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
            });
        };

        init();
    }, []);

    return (
        <div>
            <h2>Call</h2>
            <video ref={localVideoRef} autoPlay muted></video>
            <video ref={remoteVideoRef} autoPlay></video>
        </div>
    );
};
