"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
import SettingsIcon from '@mui/icons-material/Settings';

interface MusicDetails {
    id: string;
    musicUrl: string;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
    isFavourite: boolean;
}

const WebMusicPlayer = ({ musicDetails }: { musicDetails: MusicDetails[] }) => {

    const musicRef = useRef<HTMLAudioElement | null>(null);
    const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isLooping, setIsLooping] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [volume, setVolume] = useState<number>(50);
    const [duration, setDuration] = useState<number>(0);

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

    const toggleFavorite = () => setIsFavorite(!isFavorite);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    useEffect(() => {
        const music = musicRef.current;
        if (music) {
            music.volume = volume / 100; // Convert percentage to a value between 0.0 and 1.0
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

    return (
        <>
            <div className="fixed bottom-1 md:bottom-0 w-full right-0 h-20 text-white bg-slate-800 z-50">
                <audio ref={musicRef} src={musicDetails[0].musicUrl} />
                <Slider
                    className="fixed bottom-16 md:bottom-[65px]"
                    size="small"
                    value={currentTime}
                    min={0}
                    max={duration}
                    onChange={handleSeek}
                    aria-label="Time"
                    valueLabelDisplay="auto"
                />
                <div className="md:pl-10 md:pr-10 pl-3 pr-3 mt-2 md:mt-5">
                    <div className="flex flex-row gap-2 items-center justify-between md:justify-normal">
                        <section className="flex flex-row gap-1 items-center md:gap-3">
                            <Image className="rounded-md" height={40} width={40} src={musicDetails[0].thumbnailUrl} alt="Thumbnail" />
                            <p className="flex flex-col md:w-[25rem] w-[9rem] overflow-x-hidden whitespace-nowrap">
                                <span className="md:text-[20px] text-[14px]">{musicDetails[0].musicTitle}</span>
                                <span className="text-slate-500 text-[10px]">Artist : {musicDetails[0].musicArtist}</span>
                            </p>
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
                        <IconButton className="md:hidden" color="primary" aria-label="favorite" onClick={toggleFavorite}>
                            {musicDetails[0].isFavourite ? <FavoriteIcon fontSize="medium" color="secondary" /> : <FavoriteBorderIcon fontSize="medium" />}
                        </IconButton>
                        <IconButton className="md:hidden" color="primary" aria-label="repeat" onClick={() => setIsLooping(!isLooping)}>
                            {isLooping ? (
                                <RepeatIcon fontSize="medium" color="primary" />) : (
                                <RepeatOneIcon fontSize="medium" color="primary" />
                            )}
                        </IconButton>
                        <IconButton className="md:hidden" onClick={togglePlayPause} color="primary" aria-label="play/pause">
                            {isPlaying ? <PauseCircleIcon fontSize="medium" /> : <PlayCircleIcon fontSize="medium" />}
                        </IconButton>

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
                            <Tooltip title="play/pause">
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

                        <div className="ml-16">
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
                                    onClick={toggleFavorite}
                                    className="hover:scale-110 hover:text-red-500 transition-transform duration-300 ease-in-out"
                                >
                                    {isFavorite ? <FavoriteIcon fontSize="medium" color="secondary" /> : <FavoriteBorderIcon fontSize="medium" />}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="quality">
                                <IconButton
                                    color="primary"
                                    aria-label="quality"
                                    className="hover:rotate-90 hover:text-green-500 transition-transform duration-300 ease-in-out"
                                >
                                    <SettingsIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>

                            <section
                                className="flex flex-row items-center relative"
                                onMouseEnter={() => setShowVolumeSlider(true)}
                                onMouseLeave={() => setShowVolumeSlider(false)}
                            >
                                <Tooltip title="volume">
                                    <IconButton
                                        color="primary"
                                        aria-label="volume"
                                        className="hover:scale-110 hover:text-purple-500 transition-transform duration-300 ease-in-out"
                                    >
                                        <VolumeUp />
                                    </IconButton>
                                </Tooltip>

                                <div className={`absolute ${showVolumeSlider ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 items-center flex`}>
                                    <Slider
                                        className="fixed right-10 w-20"
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
            </div >
        </>
    );
};

export default WebMusicPlayer;

