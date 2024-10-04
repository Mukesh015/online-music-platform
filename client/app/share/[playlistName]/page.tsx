"use client"
import Tooltip from '@mui/material/Tooltip';
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import loadingAnimation from "@/lottie/Animation - 1725478247574.json"
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShareIcon from '@mui/icons-material/Share';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import musicWave from "@/lottie/Animation - 1724571535854.json";
import { downLoadMusic } from '@/config/firebase/config';


const itemVariants = {
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100,
        },
    },
    hidden: {
        y: 50,
        opacity: 0
    }
};

const containerVariants = {
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
        }
    },
    hidden: {
        opacity: 0
    }
};

interface Props {
    params: {
        playlistName: string;
    };
}

interface PlayList {
    id: number;
    musicUrl: string;
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
    createdAt: string;
}

const sharedPlaylistDetails = gql`
    query GetSharedPlaylistDetails($userId: String!, $playlistName: String!) {
        getSharedPlaylistDetails(userId: $userId, playlistName: $playlistName){

            id
            musicUrl
            isFavourite
            musicTitle
            thumbnailUrl
            musicArtist
            createdAt
        }
    }

`


const SharePage: React.FC<Props> = ({ params }) => {

    const [currentPlayMusic, setCurrentPlayMusic] = useState<string | null>(null);
    const [playlistSongs, setPlaylistSongs] = useState<PlayList[] | null>(null)

    const playlistName = decodeURIComponent(params.playlistName);
    const searchParams = useSearchParams();

    const userId = searchParams.get("uID");

    const { loading, data, error } = useQuery(sharedPlaylistDetails, {
        variables: { userId: userId, playlistName: playlistName },
    });

    const handlePlay = (musicUrl: string) => {
        setCurrentPlayMusic(musicUrl);
    }

    useEffect(() => {
        if (data) {
            setPlaylistSongs(data.getSharedPlaylistDetails)
        }
    }, [data, setPlaylistSongs]);

    return (
        <div className="bg-slate-950 h-screen w-screen pb-20">
            <div className="pt-20 md:px-10 w-full px-3">
                {currentPlayMusic && <audio autoPlay src={currentPlayMusic} />}
                <p className="text-xl font-bold md:ml-8 mt-10 text-sky-600 flex space-x-2 items-center">
                    <ShareIcon />
                    <span>Shared playlist</span>
                </p>
                {loading ? (
                    <div className='h-full w-full flex flex-col mt-60 md:mt-24 justify-center items-center bg-slate-950'>
                        <Lottie className="h-40 md:h-60" animationData={loadingAnimation} />
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className='md:h-[70vh] mt-10 h-[78vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full'>
                        {playlistSongs ? (playlistSongs.map(music => (
                            <motion.section
                                key={music.id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-col gap-2 mb-3 w-full md:w-auto md:hover:bg-slate-900 transition-colors duration-300"
                            >
                                <div className="flex w-full flex-row cursor-pointer items-center">
                                    <Tooltip onClick={() => handlePlay(music.musicUrl)} title="click to play">
                                        <div className='flex flex-row gap-3 w-full md:px-10 md:py-3 cursor-pointer rounded-sm items-center'>
                                            <div>
                                                <Image
                                                    className="rounded-md"
                                                    height={50}
                                                    width={50}
                                                    src={music.thumbnailUrl}
                                                    alt="album cover"
                                                />
                                            </div>
                                            <div className="w-[70vw] overflow-hidden space-y-2">
                                                <p className="whitespace-nowrap text-slate-300 truncate">{music.musicTitle}</p>
                                                <p className="justify-between flex flex-row">
                                                    <span className="space-x-2 text-slate-500 text-[13px]">Artist: {music.musicArtist}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </Tooltip>
                                    <div>
                                        {currentPlayMusic === music.musicUrl && <Lottie className="h-6 w-6 md:mr-10" animationData={musicWave} />}
                                    </div>
                                    <IconButton onClick={() => downLoadMusic(music.musicUrl)} className='mr-5' color="primary">
                                        <FileDownloadIcon />
                                    </IconButton>
                                </div>
                                <div className="border border-slate-800"></div>
                            </motion.section>
                        ))) : (
                            <div className="w-screen">
                                <h1 className="text-2xl text-white">No Music In this Playlist</h1>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div >
    )
}

export default SharePage;