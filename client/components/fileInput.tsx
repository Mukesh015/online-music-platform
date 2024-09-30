import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useCallback, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { uploadMusic, getDownloadLink, auth, uploadMusicThumbnail } from "@/config/firebase/config";
import { decodeMetaData, decodeMetaDataToBlob } from "@/lib/musicMetadata";
import { useAuthToken } from "@/providers/authTokenProvider";
import CircularProgress from '@mui/material/CircularProgress';
import { gql, useQuery } from "@apollo/client";
import RemoveIcon from '@mui/icons-material/Remove';
import { syncMusicDetails } from "@/lib/feature";

const getUserMusics = gql`{
    getMusicByUserId{
        id
        musicUrl
        isFavourite
        musicTitle
        thumbnailUrl
        musicArtist
    }
}
`

interface MusicDetail {
    id: number;
    musicUrl: string;
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
}

interface Props {
    isOpen: boolean;
    visible: string;
    idForplaylist: number[],
    cleanup: () => void;
    onClose: () => void;
    showAlert: (msg: string) => void;
    setSeverity: (severity: boolean) => void;
    addToPlaylist: (id: number) => void;
    removeToPlayList: (id: number) => void;
    createPlaylist: (playlistName: string) => void;
}

const FileInput: React.FC<Props> = ({ isOpen, cleanup, createPlaylist, onClose, idForplaylist, removeToPlayList, visible, showAlert, setSeverity, addToPlaylist }) => {
    const { token } = useAuthToken();
    const { loading, error, data } = useQuery(getUserMusics);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [musicDetails, setMusicDetails] = useState<MusicDetail[]>([]);
    const [isAddedToPlaylist, setIsAddedToPlaylist] = useState<boolean>(false);
    const [newPlaylistName, setNewPlaylistName] = useState<string>("");

    const toggleAddAndRemoveToPlaylist = () => {
        setIsAddedToPlaylist(!isAddedToPlaylist);
    }

    const handleClosePopup = useCallback(() => {
        onClose();
        setUploadFile(null);
        setIsLoading(false);
    }, [onClose])

    const handleSetUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
            const blob = await decodeMetaDataToBlob(e.target.files[0]);
            setImageBlob(blob);
        }
    };

    const handleAddToPlaylist = (id: number) => {
        addToPlaylist(id);
        toggleAddAndRemoveToPlaylist();
    }

    const handleRemoveFromPlaylist = (id: number) => {
        removeToPlayList(id);
        toggleAddAndRemoveToPlaylist();
    }

    const handleSentMusicDetails = useCallback(async (link: string, thumbnailLink: string) => {
        if (uploadFile && imageBlob) {
            try {
                const metadata = await decodeMetaData(uploadFile);
                if (token && metadata) {
                    const response = await syncMusicDetails(token, link, metadata.title, metadata.artist, thumbnailLink)
                    if (response.status === 1) {
                        setSeverity(true);
                        showAlert("Music Details synced successfully");
                    } else {
                        setSeverity(false);
                        showAlert("Music Details synced failed");
                    }
                    setUploadFile(null);
                    handleClosePopup();
                }
            } catch (e) {
                handleClosePopup();
                setSeverity(false);
                showAlert("Failed to send details, server error");
            }
        }
    }, [uploadFile, imageBlob, token, handleClosePopup, showAlert, setSeverity]);


    const handleMusicUpload = useCallback(async () => {
        try {
            if (uploadFile && imageBlob) {
                setIsLoading(true);
                const result = await uploadMusic(uploadFile);
                const musicPath = result.ref.fullPath;
                const musicLink = await getDownloadLink(musicPath);
                const thumbnail = await uploadMusicThumbnail(imageBlob)
                const thumbnailPath = thumbnail.ref.fullPath;
                const thumbnailLink = await getDownloadLink(thumbnailPath);
                handleSentMusicDetails(musicLink, thumbnailLink);
                setSeverity(true);
                showAlert("Music has been successfully uploaded");
            } else {
                setSeverity(false);
                showAlert("This file is corrupted, reverting the process");
            }
        } catch (e) {
            setSeverity(false);
            showAlert("Something went wrong, please try again");
            console.error("File uploading failed", e);
        }
    }, [uploadFile, imageBlob, handleSentMusicDetails, setSeverity, showAlert]);

    useEffect(() => {
        if (data && data.getMusicByUserId) {
            setMusicDetails(data.getMusicByUserId);
        }
    }, [data]);

    return (
        <>
            {isOpen &&
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"></div>
                    {/* Modal */}
                    {visible == "fileInput" ? (
                        <div className="font-Montserrat rounded-md fixed left-1/2 top-60 z-50 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center my-20 bg-white w-[85vw] sm:rounded-lg sm:shadow-xl
                        md:left-[26rem] md:top-28 md:translate-x-0 md:translate-y-0 md:w-[45vw]">
                            <div className="mt-10 mb-10 text-center">
                                <h2 className="text-2xl font-semibold mb-2">Upload your files</h2>
                                <p className="text-xs text-gray-500">File should be of format .mp3</p>
                            </div>
                            <form action="#" className="relative w-4/5 h-32 max-w-xs mb-3 bg-gray-100 rounded-lg shadow-inner">
                                <input onChange={handleSetUploadFile} type="file" id="file-upload" className="hidden" />
                                <label htmlFor="file-upload" className="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer">
                                    <p className="z-10 text-xs font-light text-center text-gray-500">Drag & Drop your files here</p>
                                    <svg className="z-10 w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                    </svg>
                                </label>
                            </form>
                            {uploadFile && <span className="w-80 overflow-hidden whitespace-nowrap">{`${uploadFile.name}`}</span>}
                            <section className="flex flex-row mt-4 justify-end gap-5 pb-10 w-full pr-5">
                                <Button onClick={() => handleClosePopup()} variant="text">Close</Button>
                                <Button disabled={isLoading} id="upload-btn" onClick={() => handleMusicUpload()} variant="contained">
                                    {isLoading && <CircularProgress className="mr-2" color="inherit" size={17} />}
                                    Upload
                                </Button>
                            </section>
                        </div>
                    ) : (
                        <div className="font-Montserrat rounded-md fixed left-1/2 top-72 md:top-0 z-50 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center my-20 md:h-[73vh] bg-white w-[85vw] sm:rounded-lg sm:shadow-xl md:left-[26rem] md:translate-x-0 md:translate-y-0 md:w-[45vw]">
                            <div className="mt-10 mb-10 text-center">
                                <h2 className="text-2xl font-semibold mb-2">Create new playlist / Add into playlist</h2>
                                <p className="text-xs text-gray-500">Folder name must be unique</p>
                            </div>
                            <section className="flex flex-row gap-10">
                                <TextField onChange={(e) => setNewPlaylistName(e.target.value)} id="outlined-basic" label="Enter playlist name" variant="outlined" />
                            </section>
                            <section className="max-w-[75vw] overflow-y-auto mt-5 flex flex-col bg-gray-100 md:w-[40vw] rounded-md h-[40vh] p-1.5">
                                <h3 className="text-red-500 text-sm mb-3">Please write the same playlist name to add music into existing playlist</h3>
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
                                <Button onClick={() => createPlaylist(newPlaylistName)} variant="contained">CREATE</Button>
                            </section>
                        </div>
                    )}
                </>
            }
        </>
    );
}

export default FileInput;