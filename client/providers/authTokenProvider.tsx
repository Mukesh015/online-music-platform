"use client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "@/config/firebase/config";
import { useDispatch } from 'react-redux';
import { setToken } from "@/lib/resolvers/auth";

interface AuthTokenContextType {
    token: string | null;
}

// Create the context
const AuthTokenContext = createContext<AuthTokenContextType | undefined>(undefined);

// Create the provider component
export const AuthTokenProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch();
    const [token, setLocalToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            // Firebase auth state listener
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                if (user) {
                    try {
                        const idToken = await user.getIdToken();
                        setLocalToken(idToken); // Update local state
                        dispatch(setToken(idToken)); // Update Redux store
                    } catch (error) {
                        console.error("Error fetching token: ", error);
                        setLocalToken(""); // Update local state
                        dispatch(setToken("")); // Update Redux store
                    }
                } else {
                    // User is signed out
                    setLocalToken(""); // Update local state
                    dispatch(setToken("")); // Update Redux store
                }
            });

            // Cleanup listener on unmount
            return () => unsubscribe();
        };

        fetchToken();
    }, [dispatch]); // Empty dependency array to run only once when the component mounts

    return (
        <AuthTokenContext.Provider value={{ token }}>
            {children}
        </AuthTokenContext.Provider>
    );
};

// Hook to access the auth token
export const useAuthToken = (): AuthTokenContextType => {
    const context = useContext(AuthTokenContext);
    if (!context) {
        throw new Error("useAuthToken must be used within an AuthTokenProvider");
    }
    return context;
};
