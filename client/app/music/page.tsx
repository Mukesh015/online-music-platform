"use client"
import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useState } from "react";
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
import Alert from '@mui/material/Alert';


const TEST_QUERY = gql`
    {
        musics{
            id
        }
        index
        getMusicByUserId{
        id
        }
    }
`;

const MusicPage: React.FC = () => {

    const [showMenu, setshowMenu] = React.useState<null | HTMLElement>(null);
    const [isOpenFileInput, setIsOpenFileInput] = useState<boolean>(false);
    const [showMobilemenu, setShowMobileMenu] = useState<boolean>(false);
    const [showFavoriteSongs, setShowFavoriteSongs] = useState<boolean>(false);
    const [fileInputVisibleProps, setFileInputVisibleProps] = useState<string>("")
    const { loading, error, data, refetch } = useQuery(TEST_QUERY);
    const [showAlert, setShowAlert] = useState<boolean | null>(null);


    const token = useSelector((state: RootState) => state.authToken.token);

    const open = Boolean(showMenu);

    const handleShowAlert = () => setShowAlert(true);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setshowMenu(event.currentTarget);
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
        setShowMobileMenu(!showMobilemenu); // Corrected typo in showMobileMenu

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

    useEffect(() => {
        console.log(data);
        if (error) {
            console.error('Error fetching data', error);
        }
        if (token) {
            console.log("token getting token", token);
            refetch();
        }
    }, [data, error, refetch, token]);

    return (
        <>
            <div className="relative min-h-screen max-w-screen md:flex md:flex-row z-20 bg-slate-950 font-Montserrat">
                <div className="pt-20 p-5 md:pt-28 md:pl-10 md:pr-10">
                    <div className="flex flex-col gap-7 md:w-[90vw] md:overflow-x-auto">
                        <section id='dekstop-view' className="hidden md:flex flex-row justify-between text-white text-xl items-center">
                            <h1 className='ml-10'>Recent Songs</h1>
                            <Tooltip title="search songs">
                                <section className='flex'>
                                    <input className='w-[40rem] hidden md:flex bg-inherit border border-slate-500 rounded-3xl text-white text-sm py-2 px-4' placeholder='Enter song name here ...' type="text" />
                                    <IconButton className='fixed right-[31rem]' color="secondary" aria-label="search-icon">
                                        <SearchIcon fontSize="medium" />
                                    </IconButton>
                                </section>
                            </Tooltip>
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
                        <section className="flex flex-col w-full md:w-auto ">
                            <div className="flex flex-row gap-3 w-full md:px-10 md:py-3 cursor-pointer rounded-sm items-center">
                                <div>
                                    <Image
                                        className='rounded-full'
                                        height={50}
                                        width={50}
                                        src="https://imgv3.fotor.com/images/blog-richtext-image/born-to-die-music-album-cover.png"
                                        alt="album cover"
                                    />
                                </div>
                                <div className="text-slate-500 w-full overflow-hidden">
                                    <p className="whitespace-nowrap">
                                        Bol do na zara slowrd+
                                    </p>
                                    <p className="justify-between flex flex-row">
                                        <span className="space-x-2">Artist : Arijit Singh</span>
                                    </p>
                                </div>
                                <div>
                                    <IconButton
                                        color='primary'
                                        aria-label="more"
                                        id="long-button"
                                        aria-controls={open ? 'long-menu' : undefined}
                                        aria-expanded={open ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={handleClick}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        id="long-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'long-button',
                                        }}
                                        anchorEl={showMenu}
                                        open={open}
                                        onClose={handleClose}
                                        sx={{
                                            '& .MuiPaper-root': {
                                                backgroundColor: '#2d2d2d', // Set background color to black
                                                color: '#ffffff', // Set text color to white for contrast
                                            },
                                        }}
                                    >
                                        <MenuItem className='flex flex-row gap-2 items-center'>
                                            <PlayArrowIcon />
                                            <span>Play</span>
                                        </MenuItem>
                                        <MenuItem className='flex flex-row gap-2 items-center'>
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
                    </div>
                </div>
                <div>
                    <WebMusicPlayer musicLink={"https://firebasestorage.googleapis.com/v0/b/musically-76a5d.appspot.com/o/Musics%2FAasa%20Kooda%20Sai%20Abhyankkar%20128%20Kbps.mp3_1725310478040?alt=media&token=9e695c52-55b3-4bad-aec3-af12600a3999"} />
                </div>
            </div>
            <FileInput showAlert={handleShowAlert} isOpen={isOpenFileInput} onClose={closeUploadPopup} visible={fileInputVisibleProps} />
            {showAlert &&
                <Alert className='fixed top-80 left-[37rem] z-50' severity="error" onClose={() => { setShowAlert(false) }}>
                    This Alert displays the default close icon.
                </Alert>
            }

        </>
    );
};

export default MusicPage;
