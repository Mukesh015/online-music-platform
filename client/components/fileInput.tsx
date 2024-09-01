import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useCallback, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { uploadMusic, getDownloadLink, auth } from "@/config/firebase/config";
import { useAuthToken } from "@/providers/authTokenProvider";

interface Props {
    isOpen: boolean;
    visible: string;
    onClose: () => void;
}

const FileInput: React.FC<Props> = ({ isOpen, onClose, visible }) => {
    const { token } = useAuthToken();
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const handleClosePopup = () => {
        onClose();
        setUploadFile(null);
    }

    const handleSetUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
        }
    };

    // const handleSentMusicDetails = useCallback(async (link: string) => {
    //     if (uploadFile) {
    //         try {
    //             const metadata = await decodeMetaData(uploadFile); // Get metadata like title and artist

    //             // Prepare form data
    //             const formData = new FormData();
    //             formData.append('musicUrl', link);
    //             formData.append('musicTitle', metadata?.title || '');
    //             formData.append('musicArtist', metadata?.artist || '');
    //             formData.append('thumbnailUrl', blob, 'thumbnail.png'); // Append Blob as file

    //             const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/music`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'authorization': `Bearer ${token}`,
    //                 },
    //                 body: formData, // Use formData instead of JSON.stringify
    //             });

    //             if (response.ok) {
    //                 console.log("Music details synced successfully", response);
    //                 setUploadFile(null);
    //             } else {
    //                 console.error("Failed to sync music details, please try again");
    //                 setUploadFile(null);
    //             }
    //         } catch (e) {
    //             console.error("Failed to send details, server error", e);
    //         }
    //     }
    // }, [token, uploadFile]);


    const handleMusicUpload = useCallback(async () => {
        try {
            if (uploadFile) {
                const result = await uploadMusic(uploadFile);
                const musicPath = result.ref.fullPath;
                const musicLink = await getDownloadLink(musicPath);
                console.log("Music uploaded successfully", musicLink);
                // handleSentMusicDetails(musicLink);
            }
        } catch (e) {
            console.error("File uploading failed", e);
        }
    }, [ uploadFile]);

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
                                <p className="text-xs text-gray-500">File should be of format .mp4, .avi, .mov or .mkv</p>
                            </div>
                            <form action="#" className="relative w-4/5 h-32 max-w-xs mb-10 bg-gray-100 rounded-lg shadow-inner">
                                <input onChange={handleSetUploadFile} accept=".mp3" type="file" id="file-upload" className="hidden" />
                                <label htmlFor="file-upload" className="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer">
                                    <p className="z-10 text-xs font-light text-center text-gray-500">Drag & Drop your files here</p>
                                    <svg className="z-10 w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                    </svg>
                                </label>
                                {uploadFile && <span className="pt-2">{`${uploadFile.name}`}</span>}
                            </form>
                            <section className="flex flex-row justify-end gap-5 pb-10 w-full pr-5">
                                <Button onClick={() => handleClosePopup()} variant="text">Close</Button>
                                <Button onClick={() => handleMusicUpload()} variant="contained">Upload</Button>
                            </section>
                        </div>
                    ) : (
                        <div className="font-Montserrat rounded-md fixed left-1/2 top-72 z-50 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center my-20 bg-white w-[85vw] sm:rounded-lg sm:shadow-xl md:left-[26rem] md:top-5 md:translate-x-0 md:translate-y-0 md:w-[45vw]">
                            <div className="mt-10 mb-10 text-center">
                                <h2 className="text-2xl font-semibold mb-2">Create new playlist</h2>
                                <p className="text-xs text-gray-500">Folder name must be unique</p>
                            </div>
                            <section className="flex flex-row gap-10">
                                <TextField id="outlined-basic" label="Album name" variant="outlined" />
                            </section>
                            <section className="max-w-[75vw] overflow-y-auto mt-5 flex flex-col bg-gray-100 md:w-[40vw] rounded-md h-[40vh] p-1.5">
                                <h3 className="text-red-500 text-sm mb-3">wanna add some music</h3>
                                <div className="flex flex-row gap-2 items-center justify-between">
                                    <p className="max-w-[60vw] overflow-hidden whitespace-nowrap ">Sanam teri kasam slowed + reverbed</p>
                                    <IconButton color="primary" aria-label="add">
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            </section>
                            <section className="flex flex-row justify-end gap-5 pt-5 pb-10 w-full pr-5">
                                <Button onClick={onClose} variant="text">Close</Button>
                                <Button variant="contained">CREATE</Button>
                            </section>
                        </div>
                    )}
                </>
            }
        </>
    );
}

export default FileInput;
