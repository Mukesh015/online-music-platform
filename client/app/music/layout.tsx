"use client"

import React, { useEffect } from "react";
import WebMusicPlayer from "@/components/webmusicplayer";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function MusicLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    const currentMusic = useSelector((state: RootState) => state.currentMusic);
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
        };

        // Add the event listener
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    
    return (
        <>
            {children}
            <WebMusicPlayer musicDetails={currentMusic} />
        </>
    );
}