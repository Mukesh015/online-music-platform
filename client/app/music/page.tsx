"use client"

import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import WebMusicPlayer from "@/components/webmusicplayer";

const MusicPage: React.FC = () => {

    const path = "../../music/sanam.mp3"

    return (
        <>

            <div className="relative min-h-screen max-w-screen md:flex md:flex-row z-20 bg-slate-950 font-Montserrat">
                <div className="pt-20 p-5 md:pt-28">
                    <div className="flex flex-col gap-7 md:w-[55vw] md:overflow-x-auto">
                        <section className="flex flex-row justify-between text-white text-xl">
                            <h1>Recent Songs</h1>
                            <SearchIcon className="" fontSize="medium" />
                        </section>
                        <section className="flex flex-col w-full md:w-auto ">
                            <div className="flex flex-row gap-3 w-full hover:bg-slate-800 md:px-10 md:py-3 cursor-pointer rounded-sm">
                                <img
                                    className="w-12 h-12 rounded-full"
                                    src="https://imgv3.fotor.com/images/blog-richtext-image/born-to-die-music-album-cover.png"
                                    alt="album cover"
                                />
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
                    <WebMusicPlayer musicLink={"https://pagalfree.com/musics/128-Sanam%20Teri%20Kasam%20-%20Sanam%20Teri%20Kasam%20128%20Kbps.mp3"} />
                </div>
            </div>
        </>
    );
};

export default MusicPage;
