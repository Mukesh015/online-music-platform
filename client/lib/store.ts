import { configureStore } from '@reduxjs/toolkit';
import authTokenReducer from "./resolvers/auth"
import currentMusicReducer from './resolvers/currentMusic';

export const makeStore = () => {
    return configureStore({
        reducer: {
            authToken: authTokenReducer,
            currentMusic: currentMusicReducer
        },
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
