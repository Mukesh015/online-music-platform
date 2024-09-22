"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
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
import { addToFavorite } from "@/lib/feature";
import AlertPopup from "./alert";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface MusicDetails {
    id: number;
    musicUrl: string;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
    isFavourite: boolean;
}

const WebMusicPlayer = ({ musicDetails }: { musicDetails: MusicDetails }) => {

    const token = useSelector((state: RootState) => state.authToken.token);
    const musicRef = useRef<HTMLAudioElement | null>(null);
    const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [isLooping, setIsLooping] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [volume, setVolume] = useState<number>(50);
    const [duration, setDuration] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const previousVolumeRef = useRef<number>(volume);
    const [severity, setSeverity] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);


    const handleVolumeChange = () => {
        if (volume === 0) {
            setVolume(previousVolumeRef.current);
        } else {
            previousVolumeRef.current = volume;
            setVolume(0);
        }
    }

    const togglePlayPause = () => {
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

    const handleAddToFav = useCallback(async () => {
        // setIsFavorite(!isFavorite);
        if (musicDetails.id && token) {
            const response = await addToFavorite(musicDetails.id, token);
            if (response.status === 1) {
                handleShowAlert("Song added to favorite");
                setSeverity(true);
            } else {
                setSeverity(false);
                handleShowAlert("Something went wrong, please try again");
                console.error("Something went wrong, please try again");
            }
        }
        else {
            console.error("Music Id not provided or auth token missing, operation cant permitted");
        }
    }, [handleShowAlert, musicDetails.id, token]);

    useEffect(() => {
        setLoading(true);
    }, [musicDetails, setLoading])

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


    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.code === 'Space') {
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
        if (event.code === 'KeyL') {
            setIsLooping(!isLooping);
        }
    };

    useEffect(() => {
        const music = musicRef.current;
        if (music) {
            music.volume = volume / 100;
            music.loop = isLooping;

            const handleTimeUpdate = () => setCurrentTime(music.currentTime);
            const handleLoadedMetadata = () => setDuration(music.duration);

            music.addEventListener("timeupdate", handleTimeUpdate);
            music.addEventListener("loadedmetadata", handleLoadedMetadata);

            return () => {
                music.removeEventListener("timeupdate", handleTimeUpdate);
                music.removeEventListener("loadedmetadata", handleLoadedMetadata);
            };
        }
    }, [isPlaying, volume, isLooping, musicDetails]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <>
            <div className="font-Montserrat fixed bottom-1 md:bottom-0 w-full right-0 h-20 text-white bg-slate-800 z-50">
                <audio autoPlay onLoadedData={() => setLoading(false)} ref={musicRef} src={musicDetails.musicUrl} />
                <Slider
                    className="fixed bottom-16 md:bottom-[65px]"
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
                    <div className="flex flex-row gap-2 items-center justify-between md:justify-normal">
                        <section className="flex flex-row gap-1 items-center md:gap-3">
                            <Image className="rounded-md" height={40} width={40} src={musicDetails.thumbnailUrl} alt="Thumbnail" />
                            <section className="flex flex-col md:w-[25rem] w-[9rem] overflow-x-hidden whitespace-nowrap">
                                <p className="flex flex-row">
                                    <span className="md:text-[16px] text-[14px]">{musicDetails.musicTitle}
                                    </span>
                                </p>
                                <span className="text-slate-500 text-[12px]">Artist : {musicDetails.musicArtist}</span>
                            </section>
                        </section>
                        <section
                            className="flex flex-row items-center gap-2 relative md:hidden"
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
                        <IconButton className="md:hidden" color="primary" aria-label="favorite" onClick={() => handleAddToFav()}>
                            {musicDetails.isFavourite ? <FavoriteIcon fontSize="medium" color="secondary" /> : <FavoriteBorderIcon fontSize="medium" />}
                        </IconButton>
                        <IconButton className="md:hidden" color="primary" aria-label="repeat" onClick={() => setIsLooping(!isLooping)}>
                            {isLooping ? (
                                <RepeatIcon fontSize="medium" color="primary" />) : (
                                <RepeatOneIcon fontSize="medium" color="primary" />
                            )}
                        </IconButton>
                        <IconButton className="md:hidden" onClick={togglePlayPause} color="primary" aria-label="play / pause">
                            {isPlaying ? <PauseCircleIcon fontSize="medium" /> : <PlayCircleIcon fontSize="medium" />}
                        </IconButton>
                        {loading && (
                            <CircularProgress
                                className="md:ml-[44.9rem] ml-[19rem]"
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
                                <IconButton color="primary" aria-label="previous">
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
                                <IconButton color="primary" aria-label="next">
                                    <SkipNextIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>
                        </div>

                        <div className="ml-16 md:w-20">
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
                                        <RepeatIcon fontSize="medium" color="primary" />
                                    ) : (
                                        <RepeatOneIcon fontSize="medium" color="primary" />
                                    )}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Add to favorite">
                                <IconButton
                                    color="primary"
                                    aria-label="favorite"
                                    onClick={() => handleAddToFav()}
                                    className="hover:scale-110 hover:text-red-500 transition-transform duration-300 ease-in-out"
                                >
                                    {musicDetails.isFavourite ? <FavoriteIcon fontSize="medium" color="secondary" /> : <FavoriteBorderIcon fontSize="medium" />}
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
                                        className="fixed right-20 w-20"
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
        </>
    );
};

export default WebMusicPlayer;

