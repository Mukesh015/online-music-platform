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
    id: 38,
    musicUrl: 'https://firebasestorage.googleapis.com/v0/b/musically-76a5d.appspot.com/o/Musics%2FMaula%20Mere%20Maula%20_%20Anwar%20(2007)%20_%20Siddharth%20Koirala%20_%20Nauheed%20Cyrusi_%20Bollywood%20Romantic%20Song(MP3_160K).mp3_1725798912502?alt=media&token=ea55de78-f3e2-484e-90d2-644a2665ab02',
    isFavourite: false,
    musicTitle: 'Maula Mere Maula | Anwar (2007) | Siddharth Koirala | Nauheed Cyrusi| Bollywood Romantic Song',
    thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/musically-76a5d.appspot.com/o/Thumbnails%2F1725798921071?alt=media&token=a8a9d660-2237-4fbc-913a-826bddd73ab4',
    musicArtist: 'Romantic Hindi Songs',
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
        }
    },
});

// Export the actions
export const { setCurrentMusic } = currentMusicSlicer.actions;

// Export the reducer
export default currentMusicSlicer.reducer;
