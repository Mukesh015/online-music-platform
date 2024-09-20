import React, { useEffect, useState } from "react";
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import Button from "@mui/material/Button";
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import { Logout } from "@mui/icons-material";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/config/firebase/config";

interface props {
    name: string;
    isLoggedIn: boolean;
    isOpen: boolean
    closeMenu: () => void
    showLoginForm: () => void
}


const HamburerMenu: React.FC<props> = ({ isOpen, closeMenu, showLoginForm, isLoggedIn, name }) => {

    const [showMenu, setShowMenu] = useState<boolean>(isOpen);
    const [signOut] = useSignOut(auth);

    const handleClosehambergerMenu = () => {
        closeMenu();
        setShowMenu(false);
    }

    const handleLoginUser = () => {
        showLoginForm();
        closeMenu();
    }

    return (
        <>
            {showMenu &&
                <div className="z-50 md:hidden flex flex-col bg-black justify-center items-center right-3 top-[4rem] fixed">
                    <svg className="absolute -right-3.5 -top-7" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000000"><path d="m280-400 200-200 200 200H280Z" /></svg>
                    <ol className="flex flex-col space-y-5 px-12 py-5">
                        <li className="space-x-2">
                            <PersonIcon />
                            {isLoggedIn ? (
                                <span>{name}</span>
                            ) : (
                                <span>user</span>
                            )}
                        </li>
                        <Link href={"/"} >
                            <li onClick={() => handleClosehambergerMenu()} className="space-x-2 hover:text-blue-600">
                                <HomeIcon />
                                <span>Home</span>
                            </li>
                        </Link>
                        <Link href={"/music"}>
                            <li onClick={() => handleClosehambergerMenu()} className="space-x-2 hover:text-blue-600">
                                <MusicNoteIcon />
                                <span>Music</span>
                            </li>
                        </Link>
                        <li>
                            {isLoggedIn ? (
                                <Button onClick={() => signOut()} className="space-x-2 mt-2" variant="outlined">
                                    <Logout />
                                    <span>Logout</span>
                                </Button>
                            ) : (
                                <Button onClick={() => handleLoginUser()} className="space-x-2 mt-2" variant="outlined">
                                    <LoginIcon />
                                    <span>Login</span>
                                </Button>
                            )}
                        </li>
                    </ol>
                </div >
            }
        </>
    )
}

export default HamburerMenu;