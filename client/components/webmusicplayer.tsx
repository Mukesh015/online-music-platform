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
import musicWave from "@/lottie/Animation - 1724571535854.json";
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import Tooltip from '@mui/material/Tooltip';
import Image from "next/image";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });


interface Props {
    musicLink: string;
}

const WebMusicPlayer: React.FC<Props> = ({ musicLink }) => {

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
    }, [isPlaying, volume, isLooping]);

    return (
        <>
            <div className="hidden md:flex text-white pt-28 gap-7 p-5 md:flex-col md:items-center md:w-full">
                <Image id="player-thumbnail" height={350} width={350} className="rounded-md" src={"https://filmfare.wwmindia.com/content/2022/jun/bollywood-films-that-had-to-change-their-titles-goliyon-ki-raasleela-ram-leela.jpg"} alt="" />
                <section className="mt-5 flex flex-row items-center space-x-2 justify-between">
                    <Lottie className="w-10 h-10" animationData={musicWave} />  
                    <h2 className="text-sm text-slate-500 max-w-96">Sanam Teri Kasam (Lofi)</h2>
                </section>
                <section className=" w-[30vw] flex flex-row gap-10">
                    <Tooltip title="toggle loop">
                        <IconButton color="primary" aria-label="repeat" onClick={() => setIsLooping(!isLooping)}>
                            {isLooping ? (
                                <RepeatIcon fontSize="large" color="primary" />
                            ) : (
                                <RepeatOneIcon fontSize="large" color="primary" />
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

                        <div className={`absolute left-10 ${showVolumeSlider ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 items-center flex`}>
                            <Slider
                                className="w-[10vw]"
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
                    <Tooltip title="Add to favorite">
                        <IconButton className="ml-56" color="primary" aria-label="favorite" onClick={toggleFavorite}>
                            {isFavorite ? <FavoriteIcon fontSize="large" color="secondary" /> : <FavoriteBorderIcon fontSize="large" />}
                        </IconButton>
                    </Tooltip>
                </section>
                <audio ref={musicRef} src={musicLink} />
                <section className="flex flex-row items-center gap-3">
                    <span>{formatTime(currentTime)}</span>
                    <Slider
                        className="w-[22vw]"
                        size="small"
                        value={currentTime}
                        min={0}
                        max={duration}
                        onChange={handleSeek}
                        aria-label="Time"
                        valueLabelDisplay="auto"
                    />
                    <span>{formatTime(duration)}</span>
                </section>
                <section className="flex flex-row justify-around w-[30vw]">
                    <Tooltip title="previous">
                        <IconButton color="primary" aria-label="previous">
                            <SkipPreviousIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <section className="flex flex-row gap-4">
                        <Tooltip title="-10 sec">
                            <IconButton color="primary" aria-label="fastrewind" onClick={() => handleSkip(-10)}>
                                <FastRewindIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="play/pause">
                            <IconButton color="primary" aria-label="play" onClick={togglePlayPause}>
                                {isPlaying ? <PauseCircleIcon fontSize="large" /> : <PlayCircleIcon fontSize="large" />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="+10 sec">
                            <IconButton color="primary" aria-label="fastforward" onClick={() => handleSkip(10)}>
                                <FastForwardIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </section>
                    <Tooltip title="next">
                        <IconButton color="primary" aria-label="next">
                            <SkipNextIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </section>
            </div>
        </>
    );
};

export default WebMusicPlayer;
