"use client"
import React, { useState, useEffect, useRef } from 'react';

let globalAudioPlaying = false;

export default function RandomMusicSelector() {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        return () => {
            // Cleanup audio on unmount
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.src = '';
                audioRef.current = null;
            }
            globalAudioPlaying = false; // Reset global flag
        };
    }, []);

    const getRandomIntInclusive = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    useEffect(() => {
        // Prevent double initialization from Strict Mode
        if (hasInitialized.current || globalAudioPlaying) return;
        hasInitialized.current = true;
        globalAudioPlaying = true;

        const playTrack = async () => {
            if (isPlaying) return;

            try {
                setIsPlaying(true);
                const num = getRandomIntInclusive(1, 8);
                setCurrentTrack(num);

                const encodedPath = encodeURI(`/Photon Playlist/photon_tracks_Track0${num}.mp3`);

                // Verify the file exists
                const response = await fetch(encodedPath, { method: 'HEAD' });
                if (!response.ok) {
                    throw new Error(`Audio file not found: ${encodedPath}`);
                }

                audioRef.current = new Audio();
                audioRef.current.src = encodedPath;

                try {
                    await audioRef.current.play();
                } catch (playError) {
                    if (playError.name === 'NotAllowedError') {
                        audioRef.current.muted = true;
                        await audioRef.current.play();
                        audioRef.current.volume = 0;
                        const fadeIn = setInterval(() => {
                            if (audioRef.current && audioRef.current.volume < 1) {
                                audioRef.current.volume = Math.min(1, audioRef.current.volume + 0.1);
                            } else {
                                clearInterval(fadeIn);
                                if (audioRef.current) {
                                    audioRef.current.muted = false;
                                }
                            }
                        }, 50);
                    } else {
                        throw playError;
                    }
                }

                audioRef.current.addEventListener('ended', () => {
                    if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                    }
                    setCurrentTrack(null);
                    setIsPlaying(false);
                    globalAudioPlaying = false;
                });

            } catch (error) {
                console.error('Error playing audio:', error);
                setCurrentTrack(null);
                setIsPlaying(false);
                globalAudioPlaying = false;
            }
        };

        playTrack();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {currentTrack && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    padding: '10px',
                    backgroundColor: '#ff580f',
                    color: 'white',
                    borderRadius: '5px',
                    fontSize: '14px'
                }}>
                    Now Playing: Track {currentTrack}
                </div>
            )}
        </div>
    )
}