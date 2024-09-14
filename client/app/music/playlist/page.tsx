"use client"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import React, { useEffect, useState } from "react";
import { gql, useQuery } from '@apollo/client';
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SortIcon from '@mui/icons-material/Sort';
import Link from "next/link";
import { IconButton } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import loadingAnimation from "@/lottie/Animation - 1725478247574.json"
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });



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

interface Playlist {
    id: number;
    musicUrl: string;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
}

type PlaylistData = {
    playlistName: string;
    playlists: Playlist[];
};

const GET_PLAYLIST = gql`
    {
        getPlaylistByUserId {
            playlistName
            playlists {
                id
                musicUrl
                musicTitle
                thumbnailUrl
                musicArtist
                createdAt
            }
        }
    }
`;

const PlaylistPage: React.FC = () => {
    const token = useSelector((state: RootState) => state.authToken.token);
    const { loading, error, data, refetch } = useQuery(GET_PLAYLIST);
    const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
    const [showPlaylistsFolders, setShowPlaylistsFolders] = useState<boolean>(true);
    const [playlistName, setPlaylistName] = useState<string>("");
    const [backDisabled, setBackDisabled] = useState<boolean>(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openFolderMenu, setOpenFolderMenu] = useState<string>("");
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>, menu: string) => {
        setOpenFolderMenu(menu)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleShowSongs = (name: string) => {
        setPlaylistName(name);
        setShowPlaylistsFolders(false);
        setBackDisabled(false);
    }

    const handleBack = () => {
        setShowPlaylistsFolders(true);
        setPlaylistName("");
        setBackDisabled(true);
    }

    useEffect(() => {
        if (data && data.getPlaylistByUserId) {
            setPlaylists(data.getPlaylistByUserId);
            console.log("Fetched Playlists: ", data.getPlaylistByUserId);
        }
        if (error) {
            console.error('Error fetching data', error);
        }
        if (token) {
            refetch();
        }
    }, [data, error, token]);

    return (
        <div className="bg-slate-950 h-screen w-screen font-Montserrat md:pt-28 md:pl-20 pt-20 pl-5">
            <div className="flex flex-row items-center justify-between w-[89vw]">
                <IconButton disabled={backDisabled} onClick={() => handleBack()} color="primary">
                    <KeyboardBackspaceIcon fontSize="medium" />
                </IconButton>
                <Breadcrumbs className="text-slate-500" aria-label="breadcrumb">
                    <Link className="hover:underline" color="inherit" href="/">Home</Link>
                    <Link className="hover:underline" color="inherit" href="/music">Music</Link>
                    <Link href={"/playlist"}>
                        <Typography className={`text-slate-500 hover:underline ${playlistName ? "text-slate-500" : "text-blue-500"}`} sx={{ color: 'text.primary' }}>Playlists</Typography>
                    </Link>
                    {playlistName && <Typography className="text-blue-500" sx={{ color: 'text.primary' }}>{playlistName}</Typography>}
                </Breadcrumbs>
                <IconButton color="primary">
                    <SortIcon fontSize="medium" />
                </IconButton>
            </div>
            {showPlaylistsFolders ? (
                <div className="bg-slate-900 rounded-md w-[89vw] mt-5 overflow-x-hidden overflow-y-auto h-[75vh] md:h-[60vh]">
                    {loading ? (
                        <div className='h-full w-full    flex flex-col justify-center items-center bg-slate-950'>
                            <Lottie className="h-40 md:h-60" animationData={loadingAnimation} />
                        </div>
                    ) : (

                        <section className="text-slate-300 flex flex-col gap-5 md:p-7 p-5">
                            {playlists.map((playlist, index) => (
                                <div className="flex flex-row items-center justify-between">
                                    <section className='flex-row flex space-x-4 items-center'>
                                        <LibraryMusicIcon fontSize="medium" />
                                        <p onClick={() => handleShowSongs(playlist.playlistName)} key={index} className="hover:text-teal-500 hover:underline cursor-pointer py-3 px-3 rounded-sm">
                                            {playlist.playlistName}
                                        </p>
                                    </section>
                                    <IconButton
                                        aria-label="more"
                                        id="long-button"
                                        aria-controls={open ? 'long-menu' : undefined}
                                        aria-expanded={open ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={(e) => handleClick(e, "folder")} color="primary">
                                        <MoreHorizIcon fontSize="medium" />
                                    </IconButton>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            ) : (
                <div className="bg-slate-900 rounded-md w-[89vw] mt-5 overflow-x-hidden overflow-y-auto h-[75vh] md:h-[60vh]">
                    <section className="text-slate-300 flex flex-col gap-5 md:p-7 p-5">
                        {playlists
                            .filter(playlist => playlist.playlistName === playlistName)
                            .map(filteredPlaylist => (
                                filteredPlaylist.playlists.map((music: Playlist) => (
                                    <motion.section
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        key={music.id}
                                        className="flex flex-col w-full md:w-auto md:hover:bg-slate-900 transition-colors duration-300"
                                    >
                                        <div className="flex flex-row gap-3 w-full md:px-10 md:py-3 cursor-pointer rounded-sm items-center">
                                            <div>
                                                <Image
                                                    className="rounded-md"
                                                    height={50}
                                                    width={50}
                                                    src={music.thumbnailUrl || ""}
                                                    alt={`${music.musicTitle} album cover`}
                                                />
                                            </div>
                                            <div className="w-full overflow-hidden space-y-2">
                                                <p className="whitespace-nowrap text-slate-300 truncate">
                                                    {music.musicTitle}
                                                </p>
                                                <p className="justify-between flex flex-row">
                                                    <span className="space-x-2 text-slate-500 text-[13px]">
                                                        Artist: {music.musicArtist}
                                                    </span>
                                                </p>
                                            </div>
                                            <IconButton
                                                aria-label="more"
                                                id="long-button"
                                                aria-controls={open ? 'long-menu' : undefined}
                                                aria-expanded={open ? 'true' : undefined}
                                                aria-haspopup="true"
                                                onClick={(e) => handleClick(e, "song")} color="primary">
                                                <MoreHorizIcon fontSize="medium" />
                                            </IconButton>
                                            <div className="border border-slate-800"></div>
                                        </div>
                                    </motion.section>
                                ))
                            ))
                        }
                    </section>
                </div>
            )}
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
                {openFolderMenu === "folder" ? (
                    <>
                        <MenuItem className='flex space-x-4' onClick={handleClose}>
                            <DriveFileRenameOutlineIcon />
                            <span>Rename</span>
                        </MenuItem>
                        <MenuItem className='flex space-x-4' onClick={handleClose}>
                            <ShareIcon />
                            <span>Share playlist</span>
                        </MenuItem>
                        <MenuItem className='flex space-x-4' onClick={handleClose}>
                            <DeleteIcon />
                            <span>Delete</span>
                        </MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem className='flex space-x-4' onClick={handleClose}>
                            <PlayArrowIcon />
                            <span>Play</span>
                        </MenuItem>
                        <MenuItem className='flex space-x-4' onClick={handleClose}>
                            <QueueMusicIcon />
                            <span>Add to queue</span>
                        </MenuItem>
                        <MenuItem className='flex space-x-4' onClick={handleClose}>
                            <FavoriteIcon />
                            <span>Add to Favorite</span>
                        </MenuItem>
                        <MenuItem className='flex space-x-4' onClick={handleClose}>
                            <DownloadIcon />
                            <span>Download</span>
                        </MenuItem>
                        <MenuItem className='flex space-x-4' onClick={handleClose}>
                            <PlaylistRemoveIcon />
                            <span>Remove from playlist</span>
                        </MenuItem>
                        <MenuItem className='flex space-x-4' onClick={handleClose}>
                            <DeleteIcon />
                            <span>Delete</span>
                        </MenuItem>
                    </>
                )}
            </Menu>
        </div>
    );
};

export default PlaylistPage;