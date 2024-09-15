import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MusicDetail {
    id: number;
    musicUrl: string;
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
}

interface UserPlaylistState {
    getMusicByUserId: MusicDetail[];
}

const initialState: UserPlaylistState = {
    getMusicByUserId: [],
};

const userPlaylistSlice = createSlice({
    name: 'userPlaylist',
    initialState,
    reducers: {
        setUserPlaylist(state, action: PayloadAction<{ userMusic: MusicDetail[] }>) {
            state.getMusicByUserId = action.payload.userMusic;
        },
    },
});

export const { setUserPlaylist } = userPlaylistSlice.actions;
export default userPlaylistSlice.reducer;
