import React from "react";

interface Playlist {
    id: number;
    musicUrl: string;
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
}

type PlaylistData = {
    playlistName: string;
    playlists: Playlist[];
};

interface Props {
    playlist: PlaylistData[];
    setData: (data: PlaylistData[]) => void;
}

const FilterList: React.FC<Props> = ({ playlist, setData }) => {

    return (
        <div id="dropdownDefaultRadio" className="fixed top-[10rem] right-10 z-10 w-48 divide-y divide-gray-100 rounded-lg shadow bg-gray-900 dark:divide-gray-600">
            <ul className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200">
                <li className="hover:bg-slate-800 py-1 px-2">
                    <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        A-Z Alphabetically
                    </label>
                </li>
                <li className="hover:bg-slate-800 py-1 px-2">
                    <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        Z-A Alphabetically
                    </label>
                </li>
                <li className="hover:bg-slate-800 py-1 px-2">
                    <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        Newly first
                    </label>
                </li>
                <li className="hover:bg-slate-800 py-1 px-2">
                    <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        Oldest first
                    </label>
                </li>
            </ul>
        </div>
    )
}

export default FilterList;