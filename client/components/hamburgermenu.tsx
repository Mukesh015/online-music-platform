import React, { useEffect, useState } from "react";
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ArticleIcon from '@mui/icons-material/Article';
import Button from "@mui/material/Button";
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';

interface props {
    isOpen: boolean
}


const HamburerMenu: React.FC<props> = ({ isOpen }) => {

    const [showMenu, setShowMenu] = useState<boolean>(isOpen);

    return (
        <>
            {showMenu &&
                <div className="z-50 md:hidden flex flex-col bg-black justify-center items-center right-3 top-[4rem] fixed">
                    <svg className="absolute -right-3.5 -top-7" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000000"><path d="m280-400 200-200 200 200H280Z" /></svg>
                    <ol className="flex flex-col space-y-5 px-12 py-5">
                        <li className="space-x-2">
                            <PersonIcon />
                            <span>user</span>
                        </li>
                        <Link href={"/"} >
                            <li onClick={() => setShowMenu(false)} className="space-x-2 hover:text-blue-600">
                                <HomeIcon />
                                <span>Home</span>
                            </li>
                        </Link>
                        <Link href={"/music"}>
                            <li onClick={() => setShowMenu(false)} className="space-x-2 hover:text-blue-600">
                                <MusicNoteIcon />
                                <span>Music</span>
                            </li>
                        </Link>
                        <Link href={"/news"}>
                            <li onClick={() => setShowMenu(false)} className="space-x-2 hover:text-blue-600">
                                <ArticleIcon />
                                <span>News</span>
                            </li>
                        </Link>
                        <li>
                            <Button className="space-x-2 mt-2" variant="outlined">
                                <LoginIcon />
                                <span>Login</span>
                            </Button>
                        </li>
                    </ol>
                </div>
            }
        </>
    )
}

export default HamburerMenu;