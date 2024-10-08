"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import RepeatIcon from '@mui/icons-material/Repeat';
import IconButton from '@mui/material/IconButton';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Slider from '@mui/material/Slider';
import VolumeUp from '@mui/icons-material/VolumeUp';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import Tooltip from '@mui/material/Tooltip';
import Image from "next/image";
import CircularProgress from '@mui/material/CircularProgress';
import { green } from "@mui/material/colors";
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import AlertPopup from "./alert";
import { useDispatch } from "react-redux";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import queueService from "@/lib/queue";
import { setCurrentMusic } from "@/lib/resolvers/currentMusic";
import QueuePopup from "./queuepopup";

interface MusicDetails {
    id: number;
    musicUrl: string;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
    isFavourite: boolean;
}

const WebMusicPlayer = ({ musicDetails }: { musicDetails: MusicDetails }) => {

    const musicRef = useRef<HTMLAudioElement | null>(null);
    const dispatch = useDispatch();
    const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isLooping, setIsLooping] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [volume, setVolume] = useState<number>(50);
    const [duration, setDuration] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const previousVolumeRef = useRef<number>(volume);
    const [severity, setSeverity] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showQueue, setShowQueue] = useState<boolean>(false);
    const [playsong, setPlaySong] = useState<boolean>(false);

    const handleVolumeChange = () => {
        if (volume === 0) {
            setVolume(previousVolumeRef.current);
        } else {
            previousVolumeRef.current = volume;
            setVolume(0);
        }
    }

    const togglePlayPause = () => {
        setPlaySong(true);
        const music = musicRef.current;
        if (music) {
            if (isPlaying) {
                music.pause();
            } else {
                music.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleShowAlert = useCallback((msg: string) => {
        setAlertMessage(msg);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }, []);

    useEffect(() => {
        setLoading(true);
    }, [musicDetails, setLoading])

    useEffect(() => {
        if (musicDetails) {
            queueService.addToHistory(musicDetails);
        }
    }, [musicDetails])

    const handleSkip = (seconds: number) => {
        const music = musicRef.current;
        if (music) {
            music.currentTime = Math.min(Math.max(0, music.currentTime + seconds), duration);
        }
    };

    const handleSeek = (event: Event, newValue: number | number[]) => {
        const music = musicRef.current;
        if (music) {
            music.currentTime = typeof newValue === "number" ? newValue : newValue[0];
        }
    };

    const closeQueue = () => {
        setShowQueue(false);
    }

    const handlePlayNextSong = () => {
        const song = queueService.playNextSong(musicDetails.id);
        if (song) dispatch(setCurrentMusic(song));
    }

    const handlePlayPrevSong = () => {
        const song = queueService.playPreviousSong(musicDetails.id);
        if (song) dispatch(setCurrentMusic(song));
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.code === 'KeyP' && event.altKey) {
            event.preventDefault();
            togglePlayPause();
        }
        if (event.code === 'ArrowLeft') {
            handleSkip(-10);
        }
        if (event.code === 'ArrowRight') {
            handleSkip(+10);
        }
        if (event.code === 'ArrowUp') {
            setVolume(Math.min(100, volume + 5));
        }
        if (event.code === 'ArrowDown') {
            setVolume(Math.max(0, volume - 5));
        }
        if (event.code === 'KeyL' && event.altKey) {
            setIsLooping(!isLooping);
        }
    };

    useEffect(() => {
        const music = musicRef.current;
        if (music) {
            music.volume = volume / 100;

            const handleTimeUpdate = () => setCurrentTime(music.currentTime);
            const handleLoadedMetadata = () => setDuration(music.duration);

            music.addEventListener("timeupdate", handleTimeUpdate);
            music.addEventListener("loadedmetadata", handleLoadedMetadata);

            return () => {
                music.removeEventListener("timeupdate", handleTimeUpdate);
                music.removeEventListener("loadedmetadata", handleLoadedMetadata);
            };
        }
    }, [isPlaying, volume, musicDetails]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <>
            <div className="font-Montserrat fixed bottom-0 w-full right-0 md:h-20 h-28 text-white bg-slate-800 z-50">
                <audio loop={isLooping} autoPlay={playsong} onEnded={handlePlayNextSong} onLoadedData={() => setLoading(false)} ref={musicRef} src={musicDetails.musicUrl} />
                <Slider
                    className="fixed bottom-[90px] md:bottom-[65px]"
                    size="small"
                    value={currentTime}
                    min={0}
                    max={duration}
                    onChange={handleSeek}
                    aria-label="Time"
                    valueLabelDisplay="auto"
                    valueLabelFormat={formatTime}
                />
                <div className="md:pl-10 md:pr-10 pl-3 pr-3 mt-2 md:mt-5">
                    <div className="flex flex-col md:flex-row md:gap-2 items-center justify-around md:justify-normal">
                        <section className="flex flex-row gap-1 items-center md:gap-3">
                            <Image className="rounded-md" height={40} width={40} src={musicDetails.thumbnailUrl} alt="Thumbnail" />
                            <section className="flex flex-col md:w-[25rem] w-[95vw] overflow-x-hidden whitespace-nowrap">
                                <p className="flex flex-row">
                                    <span className="md:text-[16px] text-[14px]">{musicDetails.musicTitle}
                                    </span>
                                </p>
                                <span className="text-slate-500 text-[12px]">Artist : {musicDetails.musicArtist}</span>
                            </section>
                        </section>
                        <section className="flex flex-row items-center gap-1 relative md:hidden">
                            <div className="text-sm">
                                <span className="text-xs text-gray-500">{`${formatTime(currentTime)} / ${formatTime(duration)}`}</span>
                            </div>
                            <Tooltip title="previous">
                                <IconButton onClick={handlePlayPrevSong} color="primary" aria-label="previous">
                                    <SkipPreviousIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="-10 sec">
                                <IconButton color="primary" aria-label="fastrewind" onClick={() => handleSkip(-10)}>
                                    <FastRewindIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="play / pause">
                                <IconButton color="primary" aria-label="play" onClick={togglePlayPause}>
                                    {isPlaying ? <PauseCircleIcon fontSize="large" /> : <PlayCircleIcon fontSize="large" />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="+10 sec">
                                <IconButton color="primary" aria-label="fastforward" onClick={() => handleSkip(10)}>
                                    <FastForwardIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="next">
                                <IconButton onClick={handlePlayNextSong} color="primary" aria-label="next">
                                    <SkipNextIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="toggle loop">
                                <IconButton
                                    color="primary"
                                    aria-label="repeat"
                                    onClick={() => setIsLooping(!isLooping)}
                                    className="hover:scale-110 hover:text-blue-600 transition-transform duration-300 ease-in-out"
                                >
                                    {isLooping ? (
                                        <RepeatOneIcon fontSize="medium" color="primary" />
                                    ) : (
                                        <RepeatIcon fontSize="medium" color="primary" />
                                    )}
                                </IconButton>
                            </Tooltip>
                            <section
                                className="flex flex-row items-center gap-2 relative"
                                onMouseEnter={() => setShowVolumeSlider(true)}
                                onMouseLeave={() => setShowVolumeSlider(false)}
                            >
                                <Tooltip title="volume">
                                    <IconButton color="primary" aria-label="volume">
                                        <VolumeUp />
                                    </IconButton>
                                </Tooltip>

                                <div className={`absolute ${showVolumeSlider ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 items-center flex`}>
                                    <Slider
                                        orientation="vertical"
                                        className="h-20 fixed bottom-14"
                                        size="small"
                                        value={volume}
                                        min={0}
                                        max={100}
                                        step={1}
                                        onChange={(event, newValue) => setVolume(typeof newValue === "number" ? newValue : 50)}
                                        aria-label="Volume"
                                        valueLabelDisplay="auto"
                                    />
                                </div>
                            </section>
                        </section>
                        {loading && (
                            <CircularProgress
                                className="mt-11 -ml-7 md:ml-[44.9rem] md:mt-0"
                                size={32}
                                sx={{
                                    color: green[500],
                                    position: 'absolute',
                                    zIndex: 50,
                                }}
                            />
                        )}
                        <div className="hidden md:flex flex-row items-center gap-5 ml-32">
                            <Tooltip title="previous">
                                <IconButton onClick={handlePlayPrevSong} color="primary" aria-label="previous">
                                    <SkipPreviousIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="-10 sec">
                                <IconButton color="primary" aria-label="fastrewind" onClick={() => handleSkip(-10)}>
                                    <FastRewindIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="play / pause">
                                <IconButton color="primary" aria-label="play" onClick={togglePlayPause}>
                                    {isPlaying ? <PauseCircleIcon fontSize="large" /> : <PlayCircleIcon fontSize="large" />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="+10 sec">
                                <IconButton color="primary" aria-label="fastforward" onClick={() => handleSkip(10)}>
                                    <FastForwardIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="next">
                                <IconButton onClick={handlePlayNextSong} color="primary" aria-label="next">
                                    <SkipNextIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>
                        </div>

                        <div className="hidden md:flex md:ml-16 md:w-20">
                            <span className="text-sm">{`${formatTime(currentTime)} / ${formatTime(duration)}`}</span>
                        </div>

                        <div className="hidden md:flex flex-row items-center gap-5 ml-32">
                            <Tooltip title="toggle loop">
                                <IconButton
                                    color="primary"
                                    aria-label="repeat"
                                    onClick={() => setIsLooping(!isLooping)}
                                    className="hover:scale-110 hover:text-blue-600 transition-transform duration-300 ease-in-out"
                                >
                                    {isLooping ? (
                                        <RepeatOneIcon fontSize="medium" color="primary" />
                                    ) : (
                                        <RepeatIcon fontSize="medium" color="primary" />
                                    )}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Queued music">
                                <IconButton onClick={() => setShowQueue(true)} color="primary">
                                    <QueueMusicIcon fontSize="medium" color="primary" />
                                </IconButton>
                            </Tooltip>

                            <section
                                className="flex flex-row items-center relative"
                                onMouseEnter={() => setShowVolumeSlider(true)}
                                onMouseLeave={() => setShowVolumeSlider(false)}
                            >
                                <Tooltip title="volume">
                                    {volume === 0 ? (
                                        <IconButton
                                            onClick={() => handleVolumeChange()}
                                            color="primary"
                                            aria-label="volume"
                                            className="hover:scale-110 hover:text-purple-500 transition-transform duration-300 ease-in-out"
                                        >
                                            <VolumeOffIcon />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            onClick={() => handleVolumeChange()}
                                            color="primary"
                                            aria-label="volume"
                                            className="hover:scale-110 hover:text-purple-500 transition-transform duration-300 ease-in-out"
                                        >
                                            <VolumeUp />
                                        </IconButton>
                                    )}
                                </Tooltip>
                                <div className={`absolute ${showVolumeSlider ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 items-center flex`}>
                                    <Slider
                                        className="fixed right-7 w-32"
                                        size="small"
                                        value={volume}
                                        min={0}
                                        max={100}
                                        step={1}
                                        onChange={(event, newValue) => setVolume(typeof newValue === "number" ? newValue : 50)}
                                        aria-label="Volume"
                                        valueLabelDisplay="auto"
                                    />
                                </div>
                            </section>
                        </div>
                    </div>
                </div >
            </div>
            {showAlert && <AlertPopup severity={severity} message={alertMessage} />}
            {showQueue && <QueuePopup close={closeQueue} setSeverity={setSeverity} handleShowAlert={handleShowAlert} />}
        </>
    );
};

export default WebMusicPlayer;
