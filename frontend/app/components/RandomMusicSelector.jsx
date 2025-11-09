"use client"
import React, { useState, useEffect } from 'react';
//Autoplay audio rules may cause undesired behavior
//Tried to handle in a way that wouldn't require user interaction

export default function RandomMusicSelector(){
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [needsUserInteraction, setNeedsUserInteraction] = useState(false);
    const [audioEl, setAudioEl] = useState(null);
    
    const getRandomIntInclusive = (min, max) => {
         min = Math.ceil(min);
         max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    useEffect(() => {
        let audioElement = null;

        const playTrack = async () => {
            // Don't start a new track if one is already playing
            if (isPlaying) return;
            
            try {
                setIsPlaying(true);
                const num = getRandomIntInclusive(1,8);
                setCurrentTrack(num);
                
                const encodedPath = encodeURI(`/Photon Playlist/photon_tracks_Track0${num}.mp3`);
                
                // Verify the file exists
                const response = await fetch(encodedPath, { method: 'HEAD' });
                if (!response.ok) {
                    throw new Error(`Audio file not found: ${encodedPath}`);
                }

                audioElement = new Audio();
                audioElement.src = encodedPath;
                
                // Try to start playback immediately without muting first
                try {
                    await audioElement.play();
                } catch (playError) {
                    if (playError.name === 'NotAllowedError') {
                        // If autoplay is blocked, try with muting
                        audioElement.muted = true;
                        await audioElement.play();
                        // Gradually unmute over 100ms to avoid sudden playback
                        audioElement.volume = 0;
                        const fadeIn = setInterval(() => {
                            if (audioElement.volume < 1) {
                                audioElement.volume = Math.min(1, audioElement.volume + 0.1);
                            } else {
                                clearInterval(fadeIn);
                                audioElement.muted = false;
                            }
                        }, 50);
                    } else {
                        throw playError;
                    }
                }

                audioElement.addEventListener('ended', () => {
                    audioElement.pause();
                    audioElement.currentTime = 0;
                    setCurrentTrack(null);
                    setIsPlaying(false);
                });

            } catch (error) {
                console.error('Error playing audio:', error);
                setCurrentTrack(null);
                setIsPlaying(false);
            }
        };

        playTrack();

        // Cleanup
        return () => {
            if (audioElement) {
                audioElement.pause();
                audioElement.src = '';
                audioElement.remove();
                setIsPlaying(false);
            }
        };
    }, [])

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