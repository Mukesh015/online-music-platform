"use client"
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
                <Breadcrumbs className="text-slate-500" aria-label="breadcrumb">
                    <Link className="hover:underline" color="inherit" href="/">
                        Home
                    </Link>
                    <Link className="hover:underline" color="inherit" href="/music">
                        Music
                    </Link>
                    <Typography className="text-slate-500" sx={{ color: 'text.primary' }}>Playlists</Typography>
                </Breadcrumbs>
                <IconButton color="primary">
                    <SortIcon fontSize="medium" />
                </IconButton>
            </div>
            <div className="bg-slate-900 rounded-md w-[89vw] mt-5 overflow-x-hidden overflow-y-auto h-[75vh] md:h-[65vh]">
                <section className="text-slate-300 flex flex-col gap-5 md:p-7 p-5">
                    {playlists.map((playlist, index) => (
                        <div className="flex flex-row items-center ">
                            <LibraryMusicIcon fontSize="medium" />
                            <p key={index} className="hover:text-teal-500 hover:underline cursor-pointer py-3 px-3 rounded-sm">
                                {playlist.playlistName}
                            </p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default PlaylistPage;
