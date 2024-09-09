"use client"
import React, { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import { gql, useQuery } from '@apollo/client';
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

interface Playlist {

}

const getPlaylistNameByUserId = gql`{
    getPlaylistByUserId{
        playlistName
            playlists	{
                id
                musicUrl
                musicTitle
                thumbnailUrl
                musicArtist
                createdAt
            }

        }
    
        getPlaylistNameByUserId
        
}

`

const PlaylistPage: React.FC = () => {
    const token = useSelector((state: RootState) => state.authToken.token);

    const { loading, error, data, refetch } = useQuery(getPlaylistNameByUserId);
    const [playlistName, setPlaylistName] = useState(null)

    useEffect(() => {
        if (data) {
            setPlaylistName(data);
            console.log(data)
        }
        if (error) {
            console.error('Error fetching data', error);
        }
        if (token) {
            refetch();
        }
    }, [data, error,token])

    return (
        <>
            <div className="bg-slate-950 h-screen w-screen font-Montserrat md:pt-28 md:pl-20 pt-20 pl-5">
                <div>
                    <h1 className="text-xl md:text-2xl text-white">Your Playlists</h1>
                </div>
                <div className="bg-slate-900 rounded-md w-[89vw] mt-5 overflow-x-hidden overflow-y-auto h-[75vh] md:h-[65vh]">
                    <section className="text-slate-300 flex flex-col gap-5 md:p-7 p-5 ">
                        <p className="hover:text-teal-500 cursor-pointer hover:bg-slate-800 py-3 px-3 rounded-sm">My playlist 1</p>
                    </section>
                </div>
            </div>
        </>
    )
}

export default PlaylistPage;