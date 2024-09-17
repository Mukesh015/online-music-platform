"use client"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import React, { useCallback, useEffect, useState } from "react";
import { gql, useQuery } from '@apollo/client';
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
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
import { setCurrentMusic } from '@/lib/resolvers/currentMusic';
import { addToFavorite, addToHistory, deleteMusicFromDB, renamePlaylist, deleteplaylist } from '@/lib/feature';
import AlertPopup from '@/components/alert';
import { deleteMusic } from '@/config/firebase/config';
import FilterList from '@/components/filter';
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
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
    createdAt: Date;
}

type PlaylistData = {
    playlistName: string;
    playlists: Playlist[];
    createdAt: Date;
};

const GET_PLAYLIST = gql`
    {
        getPlaylistByUserId {
            playlistName
            createdAt
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
    const [newPlaylistName, setNewPlaylistName] = useState<string | null>(null);
    const [folderNameForRename, setFolderNameForRename] = useState<string | null>(null);
    const { loading, error, data, refetch } = useQuery(GET_PLAYLIST);
    const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
    const [showPlaylistsFolders, setShowPlaylistsFolders] = useState<boolean>(true);
    const [playlistName, setPlaylistName] = useState<string>("");
    const [backDisabled, setBackDisabled] = useState<boolean>(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openFolderMenu, setOpenFolderMenu] = useState<string>("");
    const [menuOperation, setMenuOperation] = useState<Playlist | null>(null);
    const [severity, setSeverity] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();

    const cleanup = () => {
        setFolderNameForRename(null);
        setMenuOperation(null);
    }

    const setPlaylistData = (data: PlaylistData[]) => {
        setPlaylists(data);
    };

    const closeFilter = () => {
        setShowFilter(false);
    }

    const handleShowAlert = useCallback((msg: string) => {
        setAlertMessage(msg);
        setShowAlert(true);
        refetch();
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }, [refetch]);

    const toggleOpenFiler = () => {
        setShowFilter(!showFilter);
    }

    const handleAddToFav = useCallback(async () => {
        handleClose();
        if (menuOperation?.id && token) {
            const response = await addToFavorite(menuOperation.id, token);
            if (response.status === 1) {
                handleShowAlert("Song added to favorite");
                setSeverity(true);
            } else {
                setSeverity(false);
                handleShowAlert("Something went wrong, please try again");
                console.error("fetch error:", error);
            }
            refetch();
        }
        else {
            console.error("Music Id not provided or auth token missing, operation cant permitted");
        }
    }, [menuOperation, token, refetch, handleShowAlert, error]);


    const handlePlaySong = async () => {
        handleClose();
        if (menuOperation) dispatch(setCurrentMusic(menuOperation));
        if (token && menuOperation) {
            const response = await addToHistory(token, menuOperation);
            if (response.status === 1) {
                console.log("Music history synced successfully")
            }
            else {
                console.error("Music history not synced")
            }
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>, menu: string, music: Playlist | null, playlistName: string | null) => {
        if (music) {
            setMenuOperation(music);
        }
        else if (playlistName) {
            setFolderNameForRename(playlistName);
        }
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

    const getMusicPath = (url: string) => {
        const decodedURL = decodeURIComponent(url);
        const parts = decodedURL.split('/');
        const fileNameWithParams = parts[parts.length - 1];
        const fileName = fileNameWithParams.split('?')[0];
        return fileName;
    }

    const getthumbnilPath = (url: string) => {
        const decodedURL = decodeURIComponent(url);
        const parts = decodedURL.split('/');
        const fileNameWithParams = parts[parts.length - 1];
        const fileId = fileNameWithParams.split('?')[0];
        return fileId;
    }

    const handleRenamePlaylist = useCallback(async () => {
        const newPlaylistName = prompt("Enter new playlist name");
        if (token && folderNameForRename && newPlaylistName) {
            const response = await renamePlaylist(token, folderNameForRename, newPlaylistName);
            if (response.status === 1) {
                setSeverity(true);
                handleShowAlert("Playlist renamed successfully");
            }
            else {
                setSeverity(false);
                handleShowAlert("Failed to rename playlist");
                console.error("fetch error:", error);
            }
        }
    }, [error, folderNameForRename, handleShowAlert, token]);

    const handleDeleteMusic = useCallback(async () => {
        handleClose();
        if (menuOperation?.id && token) {
            const playlist = playlists.find(playlist => playlist.playlistName === playlistName);
            if (playlist) {
                const musicDetail = playlist.playlists.find((music: Playlist) => music.id === menuOperation.id);
                if (musicDetail) {
                    const musicPath = getMusicPath(musicDetail.musicUrl);
                    const thumbnailPath = getthumbnilPath(musicDetail.thumbnailUrl);
                    const response = await deleteMusicFromDB(menuOperation.id, token);

                    if (response.statusCode === 1) {
                        setAlertMessage("Song deleted successfully");
                        setSeverity(true);
                        await deleteMusic(musicPath, thumbnailPath);
                    } else {
                        setAlertMessage("Failed to delete song");
                        setSeverity(false);
                    }
                    refetch();
                } else {
                    console.error("Music ID not found in the specified playlist.");
                }
            } else {
                console.error("Playlist not found.");
            }
        } else {
            console.error("Music ID not provided or auth token missing, operation cannot be performed.");
        }
    }, [menuOperation, playlistName, playlists, refetch, token]);

    const deletePlaylist = useCallback(async () => {
        handleClose();
        if (token && folderNameForRename) {
            const response = await deleteplaylist(token, folderNameForRename);
            if (response.status === 1) {
                setSeverity(true);
                handleShowAlert("Playlist deleted successfully");
            }
            else {
                setSeverity(false);
                handleShowAlert("Failed to delete playlist");
                console.error("fetch error:", error);
            }
        } else {
            console.error("Auth token missing, operation cannot be performed.");
        }
    }, [error, folderNameForRename, handleShowAlert, token])

    useEffect(() => {
        if (data && data.getPlaylistByUserId) {
            setPlaylists(data.getPlaylistByUserId);
        }
        if (error) {
            console.error('Error fetching data', error);
        }
        if (token) {
            refetch();
        }
    }, [data, error, refetch, token]);

    return (
        <div className="bg-slate-950 h-screen w-screen font-Montserrat md:pt-28 md:pl-20 pt-20 pl-5">
            <div className="flex flex-row items-center justify-between w-[89vw]">
                <IconButton disabled={backDisabled} onClick={() => handleBack()} color="primary">
                    <KeyboardBackspaceIcon fontSize="medium" />
                </IconButton>
                <Breadcrumbs className="text-slate-500 text-sm md:text-lg" aria-label="breadcrumb">
                    <Link className="hover:underline" color="inherit" href="/">Home</Link>
                    <Link className="hover:underline" color="inherit" href="/music">Music</Link>
                    <Link href={"/music/playlist"}>
                        <Typography className={`text-slate-500 hover:underline ${playlistName ? "text-slate-500" : "text-blue-500"}`} sx={{ color: 'text.primary' }}>Playlists</Typography>
                    </Link>
                    {playlistName && <Typography className="text-blue-500" sx={{ color: 'text.primary' }}>{playlistName}</Typography>}
                </Breadcrumbs>
                <IconButton onClick={() => toggleOpenFiler()} color="primary">
                    <SortIcon fontSize="medium" />
                </IconButton>
            </div>
            {showPlaylistsFolders ? (
                <div className="bg-slate-900 rounded-md w-[89vw] mt-5 overflow-x-hidden overflow-y-auto h-[72vh] md:h-[60vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full">
                    {loading ? (
                        <div className='h-full w-full    flex flex-col justify-center items-center bg-slate-950'>
                            <Lottie className="h-40 md:h-60" animationData={loadingAnimation} />
                        </div>
                    ) : (

                        <section className="text-slate-300 flex flex-col gap-5 md:p-7 p-5">
                            {playlists.map((playlist, index) => (
                                <div key={index} className="flex flex-row items-center justify-between ">
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
                                        onClick={(e) => handleClick(e, "folder", null, playlist.playlistName)} color="primary">
                                        <MoreHorizIcon fontSize="medium" />
                                    </IconButton>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            ) : (
                <div className="bg-slate-900 rounded-md w-[89vw] mt-5 overflow-x-hidden overflow-y-auto h-[72vh] md:h-[60vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full">
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
                                        className="flex flex-col  w-full md:w-auto md:hover:bg-slate-900 transition-colors duration-300"
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
                                                onClick={(e) => handleClick(e, "song", music, null)} color="primary">
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
                        <MenuItem className='flex space-x-4' onClick={() => handleRenamePlaylist()}>
                            <DriveFileRenameOutlineIcon />
                            <span>Rename</span>
                        </MenuItem>
                        <MenuItem className='flex space-x-4' onClick={handleClose}>
                            <ShareIcon />
                            <span>Share playlist</span>
                        </MenuItem>
                        <MenuItem className='flex space-x-4' onClick={() => deletePlaylist()}>
                            <DeleteIcon />
                            <span>Delete</span>
                        </MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem className='flex space-x-4' onClick={() => handlePlaySong()}>
                            <PlayArrowIcon />
                            <span>Play</span>
                        </MenuItem>
                        <MenuItem className='flex space-x-4'>
                            <QueueMusicIcon />
                            <span>Add to queue</span>
                        </MenuItem>
                        <MenuItem className='flex space-x-4' onClick={() => handleAddToFav()}>
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
                        <MenuItem className='flex space-x-4' onClick={() => handleDeleteMusic()}>
                            <DeleteIcon />
                            <span>Delete</span>
                        </MenuItem>
                    </>
                )}
            </Menu>
            {showAlert && <AlertPopup severity={severity} message={alertMessage} />}
            {showFilter && <FilterList playlist={playlists} closeFilter={closeFilter} setData={setPlaylistData} playlistName={playlistName} />}
        </div>
    );
};

export default PlaylistPage;