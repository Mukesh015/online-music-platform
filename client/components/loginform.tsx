import React, { useCallback, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/config/firebase/config";
import Image from "next/image";

interface Props {
    closeForm: () => void;
}

const LoginForm: React.FC<Props> = ({ closeForm }) => {

    const [signInWithGoogle] = useSignInWithGoogle(auth);
    const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);

    const handleGoogleLogin = useCallback(async () => {
        setLoadingGoogle(true);
        const res = await signInWithGoogle();
        setLoadingGoogle(false);
        closeForm();
        if (res?.user) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: res.user.uid,
                        email: res.user.email,
                        name: res.user.displayName
                    }),
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                } else {
                    console.error("Failed to sign up user");
                }
            } catch (e) {
                console.error("Error signing up user:", e);
            }
        }
    }, [closeForm, signInWithGoogle]);

    return (
        <>
            <div className="fixed border border-teal-700 ml-3 font-Montserrat top-20 md:right-10 flex flex-col gap-3 z-50 bg-black px-5 py-5 rounded-lg">
                <header className="text-neutral-500 flex flex-row items-center gap-2 justify-between">
                    <Image height={20} width={20} src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="" />
                    <span className="text-sm">Sign in to Musically with google.com</span>
                    <IconButton onClick={() => closeForm()} color="primary" aria-label="close">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </header>
                <section className="border border-gray-700 w-full h-0"></section>
                <section className="space-y-3">
                    <p className="text-[13px] md:text-sm text-neutral-500">Sign in for better experience and cloud access</p>
                    <button onClick={() => handleGoogleLogin()} className="text-white w-full bg-blue-600 py-2 rounded-3xl flex flex-row space-x-2 justify-center">
                        <span>Continue with google</span>
                        {loadingGoogle &&
                            <svg className="loader" viewBox="25 25 50 50">
                                <circle r="20" cy="50" cx="50"></circle>
                            </svg>
                        }
                    </button>
                </section>
            </div>
        </>
    )
}

export default LoginForm;