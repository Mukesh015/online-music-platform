"use client"
import { useDispatch } from 'react-redux';
import { setCurrentMusic } from '@/lib/resolvers/currentMusic';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { deleteMusic, downLoadMusic } from '@/config/firebase/config';
import Tooltip from '@mui/material/Tooltip';
import React, { useCallback, useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { gql, useQuery } from '@apollo/client';
import FileInput from '@/components/fileInput';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Image from 'next/image';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchSuggestion from '@/components/searchSuggestion';
import loadingAnimation from "@/lottie/Animation - 1725478247574.json"
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import musicWave from "@/lottie/Animation - 1724571535854.json";
import AlertPopup from '@/components/alert';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import Link from 'next/link';
import { motion, useAnimation } from "framer-motion"
import notFoundAnimation from "@/lottie/notFound.json"

const MusicQuery = gql`
    {
        musics{
            id
        }
        index
        getMusicByUserId{
            id
            musicUrl
            isFavourite
            musicTitle
            thumbnailUrl
            musicArtist
        }
        
        getFavoriteMusicByUserId{
            id
            musicUrl
            thumbnailUrl
            musicTitle
            musicArtist
        
        }
    }

`;

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


interface MusicDetail {
    id: number;
    musicUrl: string;
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
}
const MusicPage: React.FC = () => {

    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.authToken.token);
    const { loading, error, data, refetch } = useQuery(MusicQuery);
    const [showMenu, setshowMenu] = React.useState<null | HTMLElement>(null);
    const [isOpenFileInput, setIsOpenFileInput] = useState<boolean>(false);
    const [showMobilemenu, setShowMobileMenu] = useState<boolean>(false);
    const [showFavoriteSongs, setShowFavoriteSongs] = useState<boolean>(false);
    const [fileInputVisibleProps, setFileInputVisibleProps] = useState<string>("")
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showSearchSuggestion, setShowSearchSuggestion] = useState<boolean>(false);
    const [musicDetails, setMusicDetails] = useState<MusicDetail[]>([]);
    const [favoriteMusicDetails, setFavoriteMusicDetails] = useState<MusicDetail[]>([]);
    const [currentPlayingMusicDetails, setCurrentPlayingMusicDetails] = useState<MusicDetail[]>([]);
    const [selectedMusicIdForMenu, setSelectedMusicIdForMenu] = useState<number | null>(null);
    const [idForplaylist, setIdForplaylist] = useState<number[]>([]);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [severity, setSeverity] = useState<boolean>(false);
    const open = Boolean(showMenu);

    const cleanup = useCallback(() => {
        console.log("Cleanup called");
        idForplaylist.splice(0, idForplaylist.length);
        console.log("idForPlaylist after cleanup:", idForplaylist);
    }, [idForplaylist]);

    const addtoplaylistById = (id: number) => {
        if (!idForplaylist.includes(id)) {
            setIdForplaylist(prevState => [...prevState, id]);
        }
        console.log("Added to playlist", idForplaylist)
    };

    const removeFromPlaylistById = (id: number) => {
        setIdForplaylist(prevState => prevState.filter(item => item !== id));
    };

    const handleAddToQueue = () => {
        console.log("Added to queue")
    };

    const handleSetSeverty = (severity: boolean) => {
        setSeverity(severity);
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
        setshowMenu(event.currentTarget);
        setSelectedMusicIdForMenu(id);
    };

    const handleClose = () => {
        setshowMenu(null);
    };

    const handleToggleFileInputPopup = () => {
        setIsOpenFileInput(!isOpenFileInput);
        setFileInputVisibleProps("fileInput");
    }

    const handleOpenCreatePlaylistPopup = () => {
        setIsOpenFileInput(!isOpenFileInput);
        setFileInputVisibleProps("createPlaylist");
    }

    const toggleFavoriteSongs = () => {
        setShowFavoriteSongs(!showFavoriteSongs);
    }

    const closeUploadPopup = () => {
        setIsOpenFileInput(false);
        cleanup();
    }
    const handleShowAlert = useCallback((msg: string) => {
        setAlertMessage(msg);
        setShowAlert(true);
        refetch();
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }, [refetch]);



    const handleToggleMobileMenu = () => {
        setShowMobileMenu(!showMobilemenu);

        const menu = document.getElementsByClassName("menu")[0] as HTMLElement;

        if (menu) {
            if (showMobilemenu) {
                menu.style.transform = "rotate(0deg)";
            } else {
                menu.style.transform = "rotate(-90deg)";
            }
            menu.style.transition = "transform 0.3s ease"; 
        }
    };

    const handleSendMusicDetails = (music: MusicDetail) => {
        setCurrentPlayingMusicDetails([music]);
        dispatch(setCurrentMusic(music));
    };

    const handleAddToFav = useCallback(async () => {
        handleClose();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/music/addtoFavorite/${selectedMusicIdForMenu}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if (response.ok) {
                handleShowAlert("Song added to favorite");
                setSeverity(true);
            }
            else {
                handleShowAlert("Song added to favorite");
                setSeverity(false);
            }
            refetch();
        }
        catch (error) {
            setSeverity(false);
            handleShowAlert("Something went wrong, please try again");
            console.error("fetch error:", error);
        }
    }, [selectedMusicIdForMenu, token, refetch, handleShowAlert]);

    const handleCreatePlaylsit = useCallback(async (playlistName: string) => {
        handleClose();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/music/addtoplaylist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    musicIds: idForplaylist,
                    playlistName: playlistName
                })
            })
            if (response.ok) {
                handleShowAlert("Playlist created successfully");
                setSeverity(true);
            }
            else {
                handleShowAlert("Failed to create playlist");
                setSeverity(false);
            }
            refetch();
            cleanup();
        }
        catch (error) {
            setSeverity(false);
            handleShowAlert("Something went wrong, please try again");
            console.error("fetch error:", error);
        }
    }, [cleanup, handleShowAlert, idForplaylist, refetch, token])

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

    const handleDeleteMusic = useCallback(async () => {
        if (selectedMusicIdForMenu !== null) {
            // Find the music details corresponding to the selected music ID
            const musicDetail = musicDetails.find(music => music.id === selectedMusicIdForMenu);

            if (musicDetail) {
                // Get the musicUrl and thumbnailUrl from the found musicDetail
                const musicPath = getMusicPath(musicDetail.musicUrl);
                const thumbnilPath = getthumbnilPath(musicDetail.thumbnailUrl);

                try {
                    // Call the deleteMusic function with the paths
                    const result = await deleteMusic(musicPath, thumbnilPath);
                    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/music/${selectedMusicIdForMenu}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        setAlertMessage("Song deleted successfully");
                        setSeverity(true);
                        refetch();
                    }
                    else {
                        setAlertMessage("Failed to delete song");
                        setSeverity(false);
                    }
                } catch (error) {
                    console.error("Error deleting music:", error);
                }
            } else {
                console.error("Music not found for the selected ID");
            }
        } else {
            console.error("No music ID selected");
        }
    }, [musicDetails, refetch, selectedMusicIdForMenu, token]);


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const searchInput = document.getElementById('search-input');
            const searchSuggestion = document.getElementById('search-suggestion');

            if (searchInput && searchSuggestion && !searchInput.contains(e.target as Node) && !searchSuggestion.contains(e.target as Node)) {
                setShowSearchSuggestion(false);
            }
        };

        if (showSearchSuggestion) {
            window.addEventListener('click', handleClickOutside);
        } else {
            window.removeEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [showSearchSuggestion]);

    const displayedMusic = showFavoriteSongs ? favoriteMusicDetails : musicDetails;

    useEffect(() => {

        if (data) {
            setMusicDetails(data.getMusicByUserId);
            setFavoriteMusicDetails(data.getFavoriteMusicByUserId)
        }
        if (error) {
            console.error('Error fetching data', error);
        }
        if (token) {
            refetch();
        }
    }, [error, refetch, token, data]);

    return (
        <>
            {loading ? (
                <div className='h-screen w-screen flex flex-col justify-center items-center bg-slate-950'>
                    <Lottie className="h-80 md:h-96" animationData={loadingAnimation} />
                </div>
            ) : (
                <div>
                    {error ? (
                        <div className='h-screen w-screen flex flex-col justify-center items-center bg-slate-950'>
                            <Lottie className="h-80 md:h-96" animationData={notFoundAnimation} />
                        </div>
                    ) : (
                        <div className="relative min-h-screen max-w-screen md:flex md:flex-row z-20 bg-slate-950 font-Montserrat">
                            <div className="pt-20 p-5 md:pt-28 md:pl-10 md:pr-10">
                                <div className="flex flex-col gap-0 md:w-[90vw] md:overflow-x-auto">
                                    <section id='dekstop-view' className="hidden mb-5 md:flex flex-row justify-between text-white text-xl items-center">
                                        <h1 className='ml-10'>Recent Songs</h1>
                                        <section className='flex'>
                                            <input id="search-input" onClick={() => setShowSearchSuggestion(true)} className='w-[40rem] hidden md:flex bg-inherit border border-slate-500 rounded-3xl text-white text-sm py-2 px-4' placeholder='Enter song name here ...' type="text" />
                                            {showSearchSuggestion && (
                                                <div className='fixed rounded-sm top-40 ml-3 bg-slate-800 h-40 border w-[40vw]' id="search-suggestion">
                                                    <SearchSuggestion />
                                                </div>
                                            )}
                                            <SearchIcon color='secondary' className='absolute mt-2 right-[34rem]' fontSize="medium" />
                                        </section>
                                        <section className="flex gap-10 flex-row items-center">
                                            <Tooltip title="search">
                                                <IconButton className='md:hidden' color="secondary" aria-label="search-icon">
                                                    <SearchIcon fontSize="medium" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="upload songs">
                                                <IconButton onClick={() => handleToggleFileInputPopup()} color="secondary" aria-label="upload">
                                                    <CloudUploadIcon fontSize="medium" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="favorite songs">
                                                {showFavoriteSongs ? (
                                                    <IconButton onClick={toggleFavoriteSongs} color="secondary">
                                                        <FavoriteIcon fontSize="medium" />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton onClick={toggleFavoriteSongs} color="secondary">
                                                        <FavoriteBorderIcon color='secondary' fontSize="medium" />
                                                    </IconButton>
                                                )}
                                            </Tooltip>
                                            <Tooltip title="playlists">
                                                <Link href={"/music/playlist"}>
                                                    <IconButton color="secondary">
                                                        <LibraryMusicIcon fontSize="medium" />
                                                    </IconButton>
                                                </Link>
                                            </Tooltip>
                                            <Tooltip title="create new playlist">
                                                <IconButton onClick={() => handleOpenCreatePlaylistPopup()} color="secondary" aria-label="add">
                                                    <AddIcon fontSize="medium" />
                                                </IconButton>
                                            </Tooltip>
                                        </section>
                                    </section>
                                    <section id='mobile-view' className='md:hidden mb-3 flex flex-row items-center justify-between'>
                                        <h1 className='text-md text-white'>Recent Songs</h1>
                                        {showMobilemenu &&
                                            <section className='items-center flex-row flex space-x-2'>
                                                <IconButton color="secondary" aria-label="search-icon">
                                                    <SearchIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={() => handleToggleFileInputPopup()} color="secondary" aria-label="upload">
                                                    <CloudUploadIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={toggleFavoriteSongs} color="secondary" aria-label="favorite">
                                                    {showFavoriteSongs ? (
                                                        <FavoriteIcon fontSize="small" />
                                                    ) : (
                                                        <FavoriteBorderIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                                <IconButton onClick={() => handleOpenCreatePlaylistPopup()} color="secondary" aria-label="add">
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </section>
                                        }
                                        <IconButton onClick={() => handleToggleMobileMenu()}>
                                            <ArrowBackIosNewIcon className='menu' color='secondary' fontSize='small' />
                                        </IconButton>
                                    </section>
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        variants={containerVariants}
                                        className='md:h-[65vh] h-[75vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full'>
                                        {displayedMusic.map((music: MusicDetail) => (
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
                                                            src={music.thumbnailUrl}
                                                            alt="album cover"
                                                        />
                                                    </div>
                                                    <div onClick={() => handleSendMusicDetails(music)} className="w-full overflow-hidden space-y-2">
                                                        <p className="whitespace-nowrap text-slate-300 truncate">{music.musicTitle}</p>
                                                        <p className="justify-between flex flex-row">
                                                            <span className="space-x-2 text-slate-500 text-[13px]">Artist: {music.musicArtist}</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        {currentPlayingMusicDetails[0]?.id === music.id && <Lottie className="h-6 w-6" animationData={musicWave} />}
                                                    </div>
                                                    <div>
                                                        <IconButton
                                                            color="primary"
                                                            aria-label="more"
                                                            id="long-button"
                                                            aria-controls={open ? 'long-menu' : undefined}
                                                            aria-expanded={open ? 'true' : undefined}
                                                            aria-haspopup="true"
                                                            onClick={(event) => handleClick(event, music.id)}
                                                        >
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                        <Menu
                                                            MenuListProps={{
                                                                'aria-labelledby': 'long-button',
                                                            }}
                                                            anchorEl={showMenu}
                                                            open={open}
                                                            onClose={handleClose}
                                                            sx={{
                                                                '& .MuiPaper-root': {
                                                                    backgroundColor: '#0F172A',
                                                                    color: '#ffffff',
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem onClick={() => handleAddToQueue()} className="flex flex-row gap-2 items-center">
                                                                <QueueMusicIcon />
                                                                <span>Add to queue</span>
                                                            </MenuItem>
                                                            <MenuItem onClick={() => { handleAddToFav() }} className="flex flex-row gap-2 items-center">
                                                                <FavoriteIcon />
                                                                <span>Add to Favorite</span>
                                                            </MenuItem>
                                                            <MenuItem onClick={() => downLoadMusic(music.musicUrl)} className="flex flex-row gap-2 items-center">
                                                                <FileDownloadIcon />
                                                                <span>Download</span>
                                                            </MenuItem>
                                                            <MenuItem onClick={() => handleDeleteMusic()} className="flex flex-row gap-2 items-center">
                                                                <DeleteIcon />
                                                                <span>Delete</span>
                                                            </MenuItem>
                                                        </Menu>
                                                    </div>
                                                </div>
                                                <div className="border border-slate-800"></div>
                                            </motion.section>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        </div >
                    )}
                </div>
            )}
            <FileInput
                idForplaylist={idForplaylist}
                isOpen={isOpenFileInput}
                visible={fileInputVisibleProps}
                removeToPlayList={removeFromPlaylistById}
                addToPlaylist={addtoplaylistById}
                setSeverity={handleSetSeverty}
                showAlert={handleShowAlert}
                onClose={closeUploadPopup}
                createPlaylist={handleCreatePlaylsit}
                cleanup={cleanup}
            />
            {showAlert && <AlertPopup severity={severity} message={alertMessage} />}
        </>
    );
};

export default MusicPage;