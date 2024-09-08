import React from "react";
import IconButton from '@mui/material/IconButton';

const PlaylistPage: React.FC = () => {
    return (
        <>
            <div className="bg-slate-950 h-screen w-screen font-Montserrat md:pt-28 md:pl-20 pt-20 pl-5">
                <div>
                    <h1 className="text-xl md:text-2xl text-white">Your Playlists</h1>
                </div>
                <div className="bg-slate-900 rounded-md w-[89vw] mt-5 overflow-x-hidden overflow-y-auto h-[75vh]">
                    <section className="text-slate-300 flex flex-col gap-5 md:p-7 p-5 ">
                        <p className="hover:text-teal-500 cursor-pointer hover:bg-slate-800 py-3 px-3 rounded-sm">My playlist 1</p>
                    </section>
                </div>
            </div>
        </>
    )
}

export default PlaylistPage;