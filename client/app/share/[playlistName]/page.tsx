"use client"

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

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [decodedUId, setDecodeuId] = useState<string>('')
    const open = Boolean(anchorEl);



    const playlistName = decodeURIComponent(params.playlistName);
    const searchParams = useSearchParams();

    const userId = searchParams.get("uID");

    const { loading, data, error, refetch } = useQuery(sharedPlaylistDetails, {
        variables: { userId: userId, playlistName: playlistName },
    });
    useEffect(() => {

        console.log("UserId : ", userId, "PlaylistName : ", playlistName);
        if (data) {
            // setDecodeuId(data.getSharedPlaylistDetails[0].userId);
            console.log(data);
        }
    }, [userId, playlistName, data]);





    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="bg-slate-950 h-screen w-screen pb-20">
            <div className="pt-20 px-10">
                <p className="text-xl font-bold md:ml-8 mt-10 text-sky-600 flex space-x-2 items-center">
                    <ShareIcon />
                    <span>Shared playlist</span>
                </p>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className='md:h-[70vh] mt-10 h-[78vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full'>
                    <motion.section
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col w-full md:w-auto md:hover:bg-slate-900 transition-colors duration-300"
                    >
                        <div className="flex flex-row gap-3 w-full md:px-10 md:py-3 cursor-pointer rounded-sm items-center">
                            <div>
                                <Image
                                    className="rounded-md"
                                    height={50}
                                    width={50}
                                    src={""}
                                    alt="album cover"
                                />
                            </div>
                            <div className="w-full overflow-hidden space-y-2">
                                <p className="whitespace-nowrap text-slate-300 truncate">Sanam teri kasam</p>
                                <p className="justify-between flex flex-row">
                                    <span className="space-x-2 text-slate-500 text-[13px]">Artist: Arijit Singh</span>
                                </p>
                            </div>
                            {/* <div>
                                {currentPlayingMusicDetails[0]?.id === music.id && <Lottie className="h-6 w-6" animationData={musicWave} />}
                            </div> */}
                            <div>
                                <IconButton
                                    color="primary"
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={open ? 'long-menu' : undefined}
                                    aria-expanded={open ? 'true' : undefined}
                                    aria-haspopup="true"
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    className='font-Montserrat'
                                    sx={{
                                        '& .MuiPaper-root': {
                                            backgroundColor: '#0F172A',
                                            color: '#ffffff',
                                        },
                                    }}
                                    id="long-menu"
                                    MenuListProps={{
                                        'aria-labelledby': 'long-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    slotProps={{
                                        paper: {
                                            style: {
                                                width: '20ch',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem className="flex flex-row gap-2 items-center">
                                        <PlayArrowIcon />
                                        <span>Add to queue</span>
                                    </MenuItem>
                                    <MenuItem className="flex flex-row gap-2 items-center">
                                        <FileDownloadIcon />
                                        <span>Download</span>
                                    </MenuItem>
                                </Menu>
                            </div>
                        </div>
                        <div className="border border-slate-800"></div>
                    </motion.section>
                </motion.div>
            </div>
        </div>
    )
}

export default SharePage;