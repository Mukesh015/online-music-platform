import React, { useEffect, useState } from "react";
import { WhatsappShareButton, FacebookShareButton, TwitterShareButton, TelegramShareButton, EmailShareButton, WhatsappIcon, FacebookIcon, TelegramIcon, EmailIcon, TwitterIcon } from "react-share";
import { motion } from "framer-motion";
import IconButton from '@mui/material/IconButton';
import { Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    close: () => void;
    playlistName: string;
    userId: string;
}


const Share: React.FC<Props> = ({ close, playlistName, userId }) => {

    const [showCopied, setShowCopied] = useState<boolean>(false);

    const handleLinkCopy = () => {
        navigator.clipboard.writeText("https://musicapp.example.com/playlist/12345");
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    }

    const handleClose = () => {
        close();
    }

    useEffect(()=>{console.log(playlistName,userId)},[playlistName, userId])

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
                <motion.div
                    className="bg-white p-6 rounded-lg shadow-lg w-screen md:w-[40rem]"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className="flex flex-row justify-between mb-5 mx-5 item-center">
                        <h2 className="text-center font-Montserrat text-xl text-blue-700 font-semibold">Share playlist!</h2>
                        <IconButton color="primary" aria-label="search-icon" onClick={handleClose}>
                            <CloseIcon fontSize="medium" />
                        </IconButton>
                    </div>

                    <div className="md:flex md:justify-around font-Montserrat grid grid-cols-3 gap-5">
                        <WhatsappShareButton className="flex flex-col items-center" url={"https://example.com"}>
                            <WhatsappIcon className="rounded-full" />
                            <span>WhatsApp</span>
                        </WhatsappShareButton>
                        <FacebookShareButton className="flex flex-col items-center" url={"https://example.com"}>
                            <FacebookIcon className="rounded-full" />
                            <span>Facebook</span>
                        </FacebookShareButton>
                        <TwitterShareButton className="flex flex-col items-center" url={"https://example.com"}>
                            <TwitterIcon className="rounded-full" />
                            <span>Twitter</span>
                        </TwitterShareButton>
                        <TelegramShareButton className="flex flex-col items-center" url={"https://example.com"}>
                            <TelegramIcon className="rounded-full" />
                            <span>Telegram</span>
                        </TelegramShareButton>
                        <EmailShareButton className="flex flex-col items-center" url={"https://example.com"}>
                            <EmailIcon className="rounded-full" />
                            <span>Email</span>
                        </EmailShareButton>
                    </div>
                    <div className="mx-5 mt-5 font-Montserrat">
                        <section className="border bg-gray-100 w-full h-10 rounded-sm px-3 items-center flex flex-row justify-between">
                            <span className="md:w-[31rem] w-[16rem] whitespace-nowrap overflow-x-hidden">https://localhost:3000/playlist/share/12/mukesh</span>
                            {showCopied ? (
                                <svg height="24px" width="24px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.5 12.5L10.167 17L19.5 8" stroke="#0541f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            ) : (
                                <Tooltip title="copy">
                                    <IconButton onClick={handleLinkCopy} color="primary" content="copy">
                                        <svg className="cursor-pointer" height="24px" width="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#0a12f5"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M10 8V7C10 6.05719 10 5.58579 10.2929 5.29289C10.5858 5 11.0572 5 12 5H17C17.9428 5 18.4142 5 18.7071 5.29289C19 5.58579 19 6.05719 19 7V12C19 12.9428 19 13.4142 18.7071 13.7071C18.4142 14 17.9428 14 17 14H16M7 19H12C12.9428 19 13.4142 19 13.7071 18.7071C14 18.4142 14 17.9428 14 17V12C14 11.0572 14 10.5858 13.7071 10.2929C13.4142 10 12.9428 10 12 10H7C6.05719 10 5.58579 10 5.29289 10.2929C5 10.5858 5 11.0572 5 12V17C5 17.9428 5 18.4142 5.29289 18.7071C5.58579 19 6.05719 19 7 19Z" stroke="#0742f2" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
                                    </IconButton>
                                </Tooltip>
                            )}
                        </section>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default Share;
