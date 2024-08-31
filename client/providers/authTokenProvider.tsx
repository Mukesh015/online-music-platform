"use client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "@/config/firebase/config";

// Define the shape of the context
interface AuthTokenContextType {
    token: string | null;
}

// Create the context
const AuthTokenContext = createContext<AuthTokenContextType | undefined>(undefined);

// Create the provider component
export const AuthTokenProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    // Fetch the token when the component mounts
    useEffect(() => {
        const fetchToken = async () => {
            if (auth.currentUser) {
                const idToken = await auth.currentUser.getIdToken();
                setToken(idToken);
                console.log("Token fetched: ", idToken);
            }
        };

        fetchToken();

        // Optionally, you can listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const idToken = await user.getIdToken();
                setToken(idToken);
            } else {
                setToken(null);
            }
        });

        // Clean up the listener
        return () => unsubscribe();
    }, []);

    // Provide the token and refresh function
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
