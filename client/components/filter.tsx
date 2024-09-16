import React, { useEffect } from "react";

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

interface Props {
    playlist: PlaylistData[];
    setData: (data: PlaylistData[]) => void;
    playlistName: string;
    closeFilter: () => void;
}

const FilterList: React.FC<Props> = ({ playlist, setData, playlistName, closeFilter }) => {


    const toDate = (date: Date | string) => {
        return typeof date === 'string' ? new Date(date) : date;
    };

    const sortPlaylistsByTitle = (data: PlaylistData[], order: 'asc' | 'desc') => {
        return data.map(pd => ({
            ...pd,
            playlists: [...pd.playlists].sort((a, b) => {
                const titleA = a.musicTitle.toLowerCase();
                const titleB = b.musicTitle.toLowerCase();
                if (titleA < titleB) return order === 'asc' ? -1 : 1;
                if (titleA > titleB) return order === 'asc' ? 1 : -1;
                return 0;
            })
        }));
    };

    const sortPlaylistsByDate = (data: PlaylistData[], order: 'asc' | 'desc') => {
        return data.map(pd => ({
            ...pd,
            playlists: [...pd.playlists].sort((a, b) => {
                const dateA = toDate(a.createdAt).getTime();
                const dateB = toDate(b.createdAt).getTime();
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            })
        }));
    };

    const sortPlaylistsDataByName = (data: PlaylistData[], order: 'asc' | 'desc') => {
        return [...data].sort((a, b) => {
            const nameA = a.playlistName.toLowerCase();
            const nameB = b.playlistName.toLowerCase();
            if (nameA < nameB) return order === 'asc' ? -1 : 1;
            if (nameA > nameB) return order === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const sortPlaylistsDataByDate = (data: PlaylistData[], order: 'asc' | 'desc') => {
        return [...data].sort((a, b) => {
            const dateA = toDate(a.createdAt).getTime();
            const dateB = toDate(b.createdAt).getTime();
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
    };

    const handleSort = (type: string, order: 'asc' | 'desc') => {
        closeFilter();
        let sortedData = [...playlist]; // Copy the playlist array to avoid direct mutation

        if (type === 'A-Z' || type === 'Z-A') {
            if (playlistName) {
                sortedData = sortPlaylistsByTitle(sortedData, order);
            } else {
                sortedData = sortPlaylistsDataByName(sortedData, order);
            }
        } else if (type === 'Newly first' || type === 'Oldest first') {
            if (playlistName) {
                // Reverse the logic for date sorting
                const actualOrder = type === 'Newly first' ? 'desc' : 'asc';
                sortedData = sortPlaylistsByDate(sortedData, actualOrder);
            } else {
                // Reverse the logic for playlistData sorting
                const actualOrder = type === 'Newly first' ? 'desc' : 'asc';
                sortedData = sortPlaylistsDataByDate(sortedData, actualOrder);
            }
        }
        setData(sortedData); // Update the state with the new sorted data
    };

    useEffect(() => {
        console.log(playlist);
    }, [playlist]);

    return (
        <div id="dropdownDefaultRadio" className="fixed top-[10rem] right-10 z-10 w-48 divide-y divide-gray-100 rounded-lg shadow bg-gray-900 dark:divide-gray-600">
            <ul className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200">
                <li className="hover:bg-slate-800 py-1 px-2" onClick={() => handleSort('A-Z', 'asc')}>
                    <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        A-Z Alphabetically
                    </label>
                </li>
                <li className="hover:bg-slate-800 py-1 px-2" onClick={() => handleSort('Z-A', 'desc')}>
                    <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        Z-A Alphabetically
                    </label>
                </li>
                <li className="hover:bg-slate-800 py-1 px-2" onClick={() => handleSort('Newly first', 'desc')}>
                    <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        Newly first
                    </label>
                </li>
                <li className="hover:bg-slate-800 py-1 px-2" onClick={() => handleSort('Oldest first', 'asc')}>
                    <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        Oldest first
                    </label>
                </li>
            </ul>
        </div>
    );
};

export default FilterList;
