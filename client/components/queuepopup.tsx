"use client"

import React, { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Image from "next/image";
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import Tooltip from '@mui/material/Tooltip';
import queueService from "@/lib/queue";
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { setCurrentMusic } from '@/lib/resolvers/currentMusic';
import { useDispatch } from "react-redux";


interface MusicDetails {
    id: number;
    musicUrl: string;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
    isFavourite: boolean;
}

interface Props {
    close: () => void;
}

const QueuePopup: React.FC<Props> = ({ close }) => {
    const dispatch = useDispatch();
    const [queueMusics, setQueueMusics] = useState<MusicDetails[]>([]);
    const [isRotating, setIsRotating] = useState<boolean>(false); // Track button rotation
    const [currentQueueMusic, setCurrentQueueMusic] = useState<MusicDetails>();

    const playMusic = (music: MusicDetails) => {
        dispatch(setCurrentMusic(music));
    }

    const removeSongFromQueue = (music: MusicDetails) => {
        queueService.removeSongById(music.id); // Remove the song from the queue in the service
        const updatedQueue = queueMusics.filter((queueMusic) => queueMusic.id !== music.id); // Filter out the song with the matching ID
        setQueueMusics(updatedQueue); // Update the state with the modified queue
    };


    const fetchQueue = () => {
        setQueueMusics(queueService.queueSongs); // Fetch queue from service
    }
    const fetchCurrentMusic = () => {
        const current = queueService.getCurrentSong();
        console.log(current);
        if (current) setCurrentQueueMusic(current);
    }

    const handleClosePopup = () => {
        close();
    }

    const clearQueue = () => {
        queueService.clearQueue(); // Clear queue from service
        setQueueMusics([]);
    }

    const refreshQueue = () => {
        setIsRotating(true); // Start rotation
        fetchQueue();
        setTimeout(() => {
            setIsRotating(false); // Stop rotation after 1 second
        }, 1000);
    };

    // Persist queue state
    useEffect(() => {
        fetchQueue();
        fetchCurrentMusic();
    }, []);

    return (
        <>
            <div className="fixed bottom-24 z-40 right-20 bg-slate-900 h-[65vh] w-[25vw] rounded-md">
                <header className="flex flex-row justify-between items-center px-2">
                    <h1 className="text-blue-500 text-md font-bold">Queued Music</h1>
                    <section className="space-x-2">
                        <Tooltip title="Clear all">
                            <IconButton onClick={clearQueue} color="primary">
                                <ClearAllIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Refresh">
                            <IconButton onClick={refreshQueue} color="primary">
                                <RefreshIcon
                                    className={`ease-in-out duration-1000 transition-transform ${isRotating ? "animate-spin" : ""}`}
                                    id="refresh-btn"
                                    fontSize="medium"
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="close">
                            <IconButton onClick={handleClosePopup} color="primary">
                                <CloseIcon fontSize="medium" />
                            </IconButton>
                        </Tooltip>
                    </section>
                </header>
                <div className="border border-slate-800"></div>
                <div className="px-2 mt-5">
                    {queueMusics.length > 0 ? (
                        <div className="h-[25rem] overflow-y-auto  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full">
                            {queueMusics.map((music: MusicDetails) => (
                                <div key={music.id} className="flex flex-row items-center justify-between mb-3">
                                    <section onClick={() => playMusic(music)} className="flex cursor-pointer flex-row gap-3">
                                        <Image className="rounded-md" height={40} width={40} src={music.thumbnailUrl} alt="Thumbnail" />
                                        <section>
                                            <p className="text-white overflow-x-hidden whitespace-nowrap w-[13rem] text-[14px]">{music.musicTitle}</p>
                                            <p className="text-slate-500 text-sm">Artist: {music.musicArtist}</p>
                                        </section>
                                    </section>
                                    <section className="flex flex-row space-x-2 items-center">
                                        {currentQueueMusic?.id === music.id &&
                                            <Tooltip title="Playing...">
                                                <PauseIcon color="primary" fontSize="medium" />
                                            </Tooltip>
                                        }

                                        <Tooltip title="Remove from queue">
                                            <IconButton onClick={() => removeSongFromQueue(music)} color="primary">
                                                <DeleteIcon fontSize="medium" />
                                            </IconButton>
                                        </Tooltip>
                                    </section>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white text-center  text-[16px]">No music in queue</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default QueuePopup;
