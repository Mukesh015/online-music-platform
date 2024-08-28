"use client"

import React, { useState, useEffect, useCallback } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import Link from "next/link";
import Image from "next/image";
import HomeIcon from '@mui/icons-material/Home';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ArticleIcon from '@mui/icons-material/Article';
import logo from "@/public/logo.jpeg"
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HamburerMenu from "./hamburgermenu";
import LoginForm from "./loginform";
import { auth } from "@/config/firebase/config";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { IconButton, ListItemIcon, Tooltip } from "@mui/material";
import { Logout } from "@mui/icons-material";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

const Navbar: React.FC = () => {

    const [user] = useAuthState(auth);
    const [signOut] = useSignOut(auth);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const [showHamburgerMenu, setShowHamburgerMenu] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [profile, setProfile] = useState<string>("")
    const [userId, setUserId] = useState<string>('');
    const [isloggedin, setisLoggedin] = useState<boolean>(true);
    const [showLoginForm, setShowLoginForm] = useState<boolean>(false);

    const handleLogout = async () => {
        try {
            const res = await signOut();
        } catch (error) {
            console.log("firebase error", error);
        }
    };

    const closeloginForm = () => {
        setShowLoginForm(false);
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const closehamburgerMenu = () => {
        setShowHamburgerMenu(false);
    }

    const checkLogin = useCallback(async () => {
        if (user) {
            setName(`${user.displayName}`)
            setEmail(`${user.email}`)
            setUserId(`${user.uid}`);
            setProfile(`${user.photoURL}`);
            setisLoggedin(true)
        } else {
            setisLoggedin(false)
        }
    }, [user])

    useEffect(() => {
        const sendPatchRequest = async () => {
            try {
                // Get the ID token
                const idToken = await auth.currentUser?.getIdToken();
                console.log("Idtoken", idToken);

                // Define the request payload
                const requestBody = {
                    url: "https://www.youtube.com/watch?v=UCkSfavBpTY&t=6s",
                    title: "Sanam Teri Kasam (Lofi)",
                    duration: 225
                };

                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/music`, {
                    method: 'POST',
                    mode: "no-cors",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify(requestBody),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Response:', result);
                } else {
                    console.error('Failed to send PATCH request:', response.statusText);
                }
            } catch (err) {
                console.error("Error during request:", err);
            }
        };

        sendPatchRequest();
    }, [auth]);

    useEffect(() => {
        checkLogin();
    }, [checkLogin])

    return (
        <>
            <nav className="flex fixed w-full py-5 justify-between pl-3 pr-3 md:pl-0 md:pr-0  md:justify-around top-0 bg-inherit z-30 font-Montserrat text-white text-lg items-center">
                <ol className="flex items-center space-x-3 cursor-pointer">
                    <Image className="h-8 w-8 rounded-full" src={logo} alt={"logo"} ></Image>
                    <span className="font-bold">MUSICALLY</span>
                </ol>
                <ol className="hidden md:flex md:flex-row md:gap-16 md:py-5">
                    <Link href={"/"}>
                        <li className="items-center flex gap-1 cursor-pointer hover:text-blue-600 duration-300 ease-in-out transition-all ">
                            <HomeIcon className="h-5 w-5" />
                            <p>Home</p>
                        </li>
                    </Link>
                    <Link href={"/music"}>
                        <li className="items-center flex gap-1 cursor-pointer hover:text-blue-600 duration-300 ease-in-out transition-all">
                            <MusicNoteIcon className="h-5 w-5" />
                            <p>Music</p>
                        </li>
                    </Link>
                    <Link href={"/news"}>
                        <li className="items-center flex gap-1 cursor-pointer hover:text-blue-600 duration-300 ease-in-out transition-all">
                            <ArticleIcon className="h-5 w-5" />
                            <p>News</p>
                        </li>
                    </Link>
                </ol>
                <ol className="hidden md:flex">
                    {isloggedin ? (
                        <Tooltip title="Account settings">
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar sx={{ width: 32, height: 32 }}>
                                    <Image className="rounded-full" height={30} width={30} src={profile} alt="profile-pic" />
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Button onClick={() => setShowLoginForm(true)} className="space-x-2" variant="outlined">
                            <LoginIcon className="h-5 w-5" />
                            <span>Login</span>
                        </Button>
                    )}
                </ol>
                <ol className="md:hidden">
                    {showHamburgerMenu ? (
                        <button onClick={() => setShowHamburgerMenu(false)}>
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    ) : (
                        <button onClick={() => setShowHamburgerMenu(true)}>
                            <MenuIcon className="h-6 w-6" />
                        </button>
                    )}
                </ol>
                {showHamburgerMenu && <HamburerMenu isOpen={showHamburgerMenu} closeMenu={closehamburgerMenu} />}
            </nav >
            {showLoginForm && <LoginForm closeForm={closeloginForm} />}

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem className="space-x-2">
                    <PersonIcon fontSize="small" />
                    <span>{name}</span>
                </MenuItem>
                <MenuItem className="space-x-2">
                    <EmailIcon fontSize="small" />
                    <span>{email}</span>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    )
}

export default Navbar;
