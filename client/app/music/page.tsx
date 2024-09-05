"use client"
import Tooltip from '@mui/material/Tooltip';
import React, { useCallback, useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WebMusicPlayer from "@/components/webmusicplayer";
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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchSuggestion from '@/components/searchSuggestion';
import loadingAnimation from "@/lottie/Animation - 1725478247574.json"
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import musicWave from "@/lottie/Animation - 1724571535854.json";
import AlertPopup from '@/components/alert';

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

interface MusicDetail {
    id: string;
    musicUrl: string;
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
}
const MusicPage: React.FC = () => {

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
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [severity, setSeverity] = useState<boolean>(false);

    const token = useSelector((state: RootState) => state.authToken.token);

    const open = Boolean(showMenu);

    const handleShowAlert = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setshowMenu(event.currentTarget);
        setSelectedMusicIdForMenu(parseInt(id));
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
    }

    const handleToggleMobileMenu = () => {
        setShowMobileMenu(!showMobilemenu);

        const menu = document.getElementsByClassName("menu")[0] as HTMLElement;

        if (menu) {
            if (showMobilemenu) {
                menu.style.transform = "rotate(0deg)";
            } else {
                menu.style.transform = "rotate(-90deg)";
            }
            menu.style.transition = "transform 0.3s ease"; // Smooth transition for rotation
        }
    };

    const handleSendMusicDetails = (music: MusicDetail) => {
        setCurrentPlayingMusicDetails([music])
    }

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
                setAlertMessage("Song added to favorite");
                setSeverity(true);
            }
            else {
                setAlertMessage("Song added to favorite");
                setSeverity(false);
            }
            handleShowAlert();
            refetch();
        }
        catch (error) {
            setAlertMessage("Something went wrong, please try again");
            setSeverity(false);
            handleShowAlert();
            console.error("fetch error:", error);
        }
    }, [selectedMusicIdForMenu, token, refetch]);

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
            console.log("fetching", data);
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
                                    <SearchIcon color='secondary' className='absolute mt-2 right-[31.5rem]' fontSize="medium" />
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
                                    <Tooltip title="create new playlist">
                                        <IconButton onClick={() => handleOpenCreatePlaylistPopup()} color="secondary" aria-label="add">
                                            <AddIcon fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                </section>
                            </section>
                            <section id='mobile-view' className='md:hidden flex flex-row items-center justify-between'>
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
                            <div className='h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full'>
                                {displayedMusic.map((music: MusicDetail) => (
                                    <section onClick={() => handleSendMusicDetails(music)} key={music.id} className="flex flex-col w-full md:w-auto md:hover:bg-slate-900">
                                        <div className="flex flex-row gap-3 w-full md:px-10 md:py-3 cursor-pointer rounded-sm items-center">
                                            <div>
                                                <Image
                                                    className='rounded-full'
                                                    height={50}
                                                    width={50}
                                                    src={music.thumbnailUrl}
                                                    alt="album cover"
                                                />
                                            </div>
                                            <div className="w-full overflow-hidden space-y-2">
                                                <p className="whitespace-nowrap text-slate-300 ">{music.musicTitle}</p>
                                                <p className="justify-between flex flex-row">
                                                    <span className="space-x-2 text-slate-500 text-[13px]">Artist : {music.musicArtist}</span>
                                                </p>
                                            </div>
                                            <div>
                                                {currentPlayingMusicDetails[0]?.id === music.id && <Lottie className='h-6 w-6' animationData={musicWave} />}
                                            </div>
                                            <div >
                                                <IconButton
                                                    color='primary'
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
                                                            backgroundColor: '#2d2d2d',
                                                            color: '#ffffff',
                                                        },
                                                    }}
                                                >
                                                    <MenuItem className='flex flex-row gap-2 items-center'>
                                                        <PlayArrowIcon />
                                                        <span>Play</span>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => { handleAddToFav() }} className='flex flex-row gap-2 items-center'>
                                                        <FavoriteIcon />
                                                        <span>Add to Favorite</span>
                                                    </MenuItem>
                                                    <MenuItem className='flex flex-row gap-2 items-center'>
                                                        <FileDownloadIcon />
                                                        <span>Download</span>
                                                    </MenuItem>
                                                    <MenuItem className='flex flex-row gap-2 items-center'>
                                                        <DeleteIcon />
                                                        <span>Delete</span>
                                                    </MenuItem>
                                                </Menu>
                                            </div>
                                        </div>
                                        <div className="border border-slate-800"></div>
                                    </section>
                                ))}
                            </div>
                        </div>
                    </div>
                    {currentPlayingMusicDetails.length > 0 && <WebMusicPlayer musicDetails={currentPlayingMusicDetails} />}
                </div>
            )}
            <FileInput showAlert={handleShowAlert} isOpen={isOpenFileInput} onClose={closeUploadPopup} visible={fileInputVisibleProps} />
            {showAlert && <AlertPopup severity={severity} message={alertMessage} />}
        </>
    );
};

export default MusicPage;
