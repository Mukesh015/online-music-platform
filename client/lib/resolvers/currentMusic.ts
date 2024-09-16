import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Music {
    id: number;
    musicUrl: string;
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
}

const initialState: Music = {
    id: 0,
    musicUrl: '',
    isFavourite: false,
    musicTitle: 'Waiting for response...',
    thumbnailUrl: 'https://app.croptracker.com/themes/default/images/green_spinner.gif',
    musicArtist: 'waiting for response...',
};

const currentMusicSlicer = createSlice({
    name: 'currentMusic',
    initialState,
    reducers: {
        setCurrentMusic(state, action: PayloadAction<Music>) {
            state.id = action.payload.id;
            state.musicUrl = action.payload.musicUrl;
            state.isFavourite = action.payload.isFavourite;
            state.musicTitle = action.payload.musicTitle;
            state.thumbnailUrl = action.payload.thumbnailUrl;
            state.musicArtist = action.payload.musicArtist;
        },
    },
});

// Export the actions
export const { setCurrentMusic } = currentMusicSlicer.actions;

// Export the reducer
export default currentMusicSlicer.reducer;
