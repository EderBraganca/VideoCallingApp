import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://192.168.2.6:5000');

const constraints = {
    video: true,
    audio: true
};

export const CallPage = ({ room }) => {
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);

    useEffect(() => {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        setPeerConnection(pc);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('candidate', {
                    target: room,
                    candidate: event.candidate
                });
            }
        };

        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        socket.on('offer', async (data) => {
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('answer', {
                target: data.from,
                sdp: pc.localDescription
            });
        });

        socket.on('answer', (data) => {
            pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        });

        socket.on('candidate', (data) => {
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        });

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((stream) => {
                    setLocalStream(stream);
                    stream.getTracks().forEach(track => pc.addTrack(track, stream));
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                })
                .catch((error) => {
                    console.error("Error accessing media devices.", error);
                });

        } else {
            console.error("mediaDevices not available");
        }
        return () => {
            pc.close();
        };
    }, [room]);

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div>
            <h1>Call Page</h1>
            <video ref={localVideoRef} autoPlay muted />
            <video ref={remoteVideoRef} autoPlay />
            <button onClick={() => window.location.href = '/'}>Leave Call</button>
        </div>
    );
}