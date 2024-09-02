"use client"
import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WebMusicPlayer from "@/components/webmusicplayer";
import IconButton from '@mui/material/IconButton';
import { gql, useQuery } from '@apollo/client';
import FileInput from '@/components/fileInput';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Image from 'next/image';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';

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

    const [isOpenFileInput, setIsOpenFileInput] = useState<boolean>(false);
    const [showMobilemenu, setShowMobileMenu] = useState<boolean>(false);
    const [showFavoriteSongs, setShowFavoriteSongs] = useState<boolean>(false);
    const [fileInputVisibleProps, setFileInputVisibleProps] = useState<string>("")
    const { loading, error, data, refetch } = useQuery(TEST_QUERY);

    const token = useSelector((state: RootState) => state.authToken.token);

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
        if(token) {
            console.log("token getting token", token);
            refetch(); 
        }
    }, [data, error,token]);

    return (
        <>
            <div className="relative min-h-screen max-w-screen md:flex md:flex-row z-20 bg-slate-950 font-Montserrat">
                <div className="pt-20 p-5 md:pt-28">
                    <div className="flex flex-col gap-7 md:w-[55vw] md:overflow-x-auto">
                        <section id='dekstop-view' className="hidden md:flex flex-row justify-between text-white text-xl items-center">
                            <h1>Recent Songs</h1>
                            <section className="flex gap-10 flex-row items-center">
                                <Tooltip title="search">
                                    <IconButton color="secondary" aria-label="search-icon">
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
                            <div className="flex flex-row gap-3 w-full hover:bg-slate-800 md:px-10 md:py-3 cursor-pointer rounded-sm items-center">
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
                                        Bol do na zara slowrd+reverbed lofi
                                    </p>
                                    <p className="justify-between flex flex-row">
                                        <span className="space-x-2">
                                            <span>Artist :</span>
                                            <span>Arijit Singh</span>
                                        </span>
                                        <span className="text-blue-500">2:30</span>
                                    </p>
                                </div>
                            </div>
                            <div className="border border-slate-800"></div>
                        </section>
                    </div>
                </div>
                <div>
                    <WebMusicPlayer musicLink={"https://firebasestorage.googleapis.com/v0/b/musically-76a5d.appspot.com/o/Musics%2Fsanam.mp3?alt=media&token=7b18d86a-cea3-4828-831d-6b49b3574104"} />
                </div>
            </div>
            <FileInput isOpen={isOpenFileInput} onClose={closeUploadPopup} visible={fileInputVisibleProps} />
        </>
    );
};

export default MusicPage;
