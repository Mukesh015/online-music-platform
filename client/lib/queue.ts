interface MusicDetails {
    id: number;
    musicUrl: string;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
    isFavourite: boolean;
}

class QueueService {
    history: MusicDetails[] = [];
    queueSongs: MusicDetails[] = [];
    currentIndex: number = -1;
    isLooping: boolean = false;

    // Add a song to history
    addToHistory(music: MusicDetails): void {
        this.history.push(music);
    }

    // Add a song to the queue
    addSong(music: MusicDetails): void {
        this.queueSongs.push(music);
    }

    // Play the next song
    playNextSong(currentSongId: number): MusicDetails | null {

        if (this.currentIndex < this.queueSongs.length - 1) {
            this.currentIndex++;
            const nextSong = this.queueSongs[this.currentIndex];
            this.addToHistory(nextSong); // Add the song to history when playing next
            return nextSong;
        }
        else if (this.history.length > 1) {
            const currentSongIndex = this.history.findIndex(music => music.id === currentSongId);
            if (currentSongIndex > 1) {
                return this.history[currentSongIndex + 1]; // Return the previous song in history
            }
        }
        return null;
    }

    // Play the previous song
    playPreviousSong(currentSongId: number): MusicDetails | null {
        // First, check if there's a previous song in the queue
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.queueSongs[this.currentIndex];
        }
        // If there's no previous song in the queue, check the history
        else if (this.history.length > 1) { // Ensure there are at least two songs in history
            const currentSongIndex = this.history.findIndex(music => music.id === currentSongId);
            if (currentSongIndex > 2) {
                return this.history[currentSongIndex - 1]; // Return the previous song in history
            }
        }

        return null; // No previous song
    }

    // Get the current song being played
    getCurrentSong(): MusicDetails | null {
        if (this.currentIndex >= 0 && this.currentIndex < this.queueSongs.length) {
            return this.queueSongs[this.currentIndex];
        }
        return null; // No song is currently being played
    }

    // Clear the queue and history
    // Clear only the queue, not the history
    clearQueue(): void {
        this.queueSongs = [];
        this.currentIndex = -1;
    }


    // Get the queue list
    getQueue(): MusicDetails[] {
        return this.queueSongs;
    }

    // Remove a song from the queue by its ID
    removeSongById(songId: number): void {
        const songIndex = this.queueSongs.findIndex(song => song.id === songId);
        if (songIndex > -1) {
            this.queueSongs.splice(songIndex, 1);

            // Adjust the currentIndex if necessary
            if (songIndex <= this.currentIndex) {
                this.currentIndex--;
            }
        }
    }
}

const queueService = new QueueService();
export default queueService;
