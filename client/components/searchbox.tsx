"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import Image from "next/image";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import loadinganimation from "@/lottie/suggestionloadinganimation.json";
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Tooltip from '@mui/material/Tooltip';

interface Props {
    musics: MusicDetail[];
    openModal: boolean;
    onClose: () => void;
}

interface Suggestion {
    id: number;
    musicTitle: string;
    musicArtist: string;
    thumbnailUrl?: string;
}

interface MusicDetail {
    id: number;
    musicUrl: string;
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'black',
    boxShadow: 24,
};

const SEARCH_QUERY = gql`
  query Search($searchString: String) {
    search(searchString: $searchString) {
      favourite {
        id
        musicTitle
        musicArtist
        thumbnailUrl
      }
      previousSearch {
        searchQuery
        searchHistoryAt
      }
      suggestion {
        id
        musicTitle
        musicArtist
        thumbnailUrl
      }
    }
  }
`;

const SAVE_SEARCH_QUERY = gql`
  mutation SaveSearchQuery($searchQuery: String!) {
    saveSearchQuery(searchQuery: $searchQuery) {
      userId
      searchQuery
      searchHistoryAt
    }
  }
`;

const FIND_SEARCH_QUERY = gql`
query SearchMusic($searchQuery: String!){
    searchMusic(searchQuery: $searchQuery) {
        id
        musicUrl
        musicTitle
        thumbnailUrl
        musicArtist
        createdAt
        isFavourite
    }
}
`

const SearchBox: React.FC<Props> = ({ openModal, onClose, musics }) => {
    const [openSearchBox, setOpenSearchBox] = useState<boolean>(openModal);
    const [searchString, setSearchString] = useState<string | null>(null);
    const [currentSearchQuery, setCurrentSearchQuery] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const token = useSelector((state: RootState) => state.authToken.token);

    const { loading, error, data, refetch } = useQuery(SEARCH_QUERY, {
        variables: { searchString },
        skip: !searchString,
    });

    const [saveSearchQuery] = useMutation(SAVE_SEARCH_QUERY);
    const [findSearchQuery] = useLazyQuery(FIND_SEARCH_QUERY);

    useEffect(() => {
        setOpenSearchBox(openModal);
    }, [openModal]);

    const handleClose = () => {
        setSuggestions([]);
        setOpenSearchBox(false)
        onClose();
    };

    const handleSaveSearchQuery = useCallback(async () => {

        if (currentSearchQuery) {
            try {
                await saveSearchQuery({ variables: { searchQuery: currentSearchQuery } });
            } catch (error) {
                console.error("Error saving search query", error);
            } finally {
                const data = await findSearchQuery({ variables: { searchQuery: currentSearchQuery } });
                console.log(data);
            }
        }
    }, [currentSearchQuery, findSearchQuery, saveSearchQuery]);


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchString(newValue);
        setCurrentSearchQuery(newValue);
    };

    const handleSearchAction = async (musicTitle: string) => {
        let searchQuery = '';
        if (currentSearchQuery) {
            if (!musicTitle) {
                searchQuery = currentSearchQuery
            }
            searchQuery = musicTitle
            try {
                await saveSearchQuery({ variables: { searchQuery: searchQuery } });
            } catch (error) {
                console.error("Error saving search query", error);
            } finally {
                await findSearchQuery({ variables: { searchQuery } });
            }
        }
    };

    const handleSaveToPlaylist = useCallback(async (music: MusicDetail) => {
        //----------------------------------------------------------------------------------------->>>>
    }, [])

    useEffect(() => {
        if (data) {
            setSuggestions(data.search.suggestion || []);
            console.log(data)
        }
        if (error) {
            console.error("Error fetching data", error);
        }
        if (token) {
            refetch();
        }
    }, [data, error, token, refetch]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && currentSearchQuery) {
                handleSaveSearchQuery();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentSearchQuery, handleSaveSearchQuery]);

    useEffect(() => {
        if (openModal) {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    }, [openModal]);

    return (
        <div>
            <Modal
                open={openSearchBox}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <header className="flex px-2 flex-row justify-between items-center w-[80vw] md:w-[45vw]">
                        <SearchIcon color="primary" fontSize="medium" />
                        <input
                            ref={inputRef}
                            placeholder="Search your desired songs ..."
                            className="bg-inherit px-5 text-white border-none w-full border focus:outline-none focus:border-transparent"
                            type="text"
                            onChange={handleSearchChange}
                        />

                        <IconButton color="primary" aria-label="search-icon" onClick={handleClose}>
                            <CloseIcon fontSize="medium" />
                        </IconButton>
                    </header>
                    <div className="border border-slate-800"></div>
                    {loading ? (
                        <div className="h-[50vh] flex flex-col justify-center">
                            <Lottie className="h-40" animationData={loadinganimation} />
                        </div>
                    ) : (
                        <section
                            className="overflow-y-auto w-[80vw] md:w-[45vw] text-slate-400 p-5 flex flex-col [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full h-[50vh]"
                        >
                            {suggestions.map((music: Suggestion, index: number) => (
                                <div
                                    key={index}
                                    onClick={() => handleSearchAction(music.musicTitle)}
                                    className="cursor-pointer font-Montserrat py-3 flex flex-row items-center gap-5"
                                >
                                    <Image
                                        className="aspect-square"
                                        height={30}
                                        width={30}
                                        src={music.thumbnailUrl || "https://i.pinimg.com/736x/e8/6a/e3/e86ae31f3047146140e271721aedf1d7.jpg"}
                                        alt={music.musicTitle}
                                    />
                                    <section className="flex flex-row justify-between items-center space-x-2">
                                        <p className="whitespace-nowrap overflow-x-hidden max-w-[35rem]">{music.musicTitle}</p>
                                        <section className="flex flex-row items-center">
                                            {musics.find(savedMusic => savedMusic.id === music.id) ? (
                                                <Tooltip title="Already saved">
                                                    <FolderSpecialIcon className="ml-1.5" color="secondary" fontSize="medium" />
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Save to cloud">
                                                    <IconButton color="primary" aria-label="search-icon" onClick={handleClose}>
                                                        <CloudUploadIcon color="success" fontSize="medium" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </section>
                                    </section>
                                </div>
                            ))}
                        </section>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default SearchBox;
