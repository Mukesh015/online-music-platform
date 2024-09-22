import { Button, IconButton } from "@mui/material"
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";


interface MusicDetail {
    id: number;
    musicUrl: string;
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
}

interface Props {
    musicDetails: MusicDetail[];
    idForplaylist: number[],
}

const AddMusicToPlaylist: React.FC<Props> = ({ musicDetails,idForplaylist }) => {

    const [isAddedToPlaylist, setIsAddedToPlaylist] = useState<boolean>(false);

    const removeFromPlaylistById = (id: number) => {
        setIdForplaylist(prevState => prevState.filter(item => item !== id));
    };

    const toggleAddAndRemoveToPlaylist = () => {
        setIsAddedToPlaylist(!isAddedToPlaylist);
    }


    const handleRemoveFromPlaylist = (id: number) => {
        removeToPlayList(id);
        toggleAddAndRemoveToPlaylist();
    }

    return (
        <div className="font-Montserrat rounded-md fixed left-1/2 top-72 md:top-0 z-50 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center my-20 md:h-[73vh] bg-white w-[85vw] sm:rounded-lg sm:shadow-xl md:left-[26rem] md:translate-x-0 md:translate-y-0 md:w-[45vw]">
            <div className="mt-10 mb-10 text-center">
                <h2 className="text-2xl font-semibold mb-2">Create new playlist</h2>
                <p className="text-xs text-gray-500">Folder name must be unique</p>
            </div>
            <section className="max-w-[75vw] overflow-y-auto mt-5 flex flex-col bg-gray-100 md:w-[40vw] rounded-md h-[40vh] p-1.5">
                <h3 className="text-red-500 text-sm mb-3">wanna add some music</h3>
                {musicDetails.map((music: MusicDetail) => (
                    <div key={music.id} className="flex flex-row gap-2 items-center justify-between">
                        <p className="max-w-[60vw] overflow-hidden whitespace-nowrap ">{music.musicTitle}</p>
                        {idForplaylist.includes(music.id) ? (
                            <IconButton
                                onClick={() => handleRemoveFromPlaylist(music.id)}
                                color="primary"
                                aria-label="remove"
                            >
                                <RemoveIcon fontSize="small" />
                            </IconButton>
                        ) : (
                            <IconButton
                                onClick={() => handleAddToPlaylist(music.id)}
                                color="primary"
                                aria-label="add"
                            >
                                <AddIcon fontSize="small" />
                            </IconButton>
                        )}
                    </div>
                ))}
            </section>
            <section className="flex flex-row justify-end gap-5 pt-5 pb-10 w-full pr-5">
                <Button onClick={onClose} variant="text">Close</Button>
                <Button onClick={() => createPlaylist(newPlaylistName)} variant="contained">Add</Button>
            </section>
        </div>
    )
}