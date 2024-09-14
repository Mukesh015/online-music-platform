type Song = {
    id: number;
    musicUrl: string;
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;

};

export class MusicPlayer {
    private queue: Song[] = [];
    private currentSong: Song | null = null;
    private loop: boolean = false;
    private isPlaying: boolean = false;


    public addToQueue(song: Song): void {
        this.queue.push(song);
        console.log(`Added ${song.musicTitle} to the queue.`);
     
        if (!this.isPlaying && this.currentSong === null) {
            this.playNextSong();
        }
    }

    public addWithPriority(song: Song): void {
        this.queue.unshift(song);
        console.log(`Added ${song.musicTitle} to the queue with priority.`);
    }

    public  playNextSong(): void {
        if (this.loop && this.currentSong) {
            console.log(`currentSong: ${this.currentSong.musicTitle}`);    
            this.playSong(this.currentSong);
            return;
        }

        if (this.queue.length > 0) {
            console.log(`Playing next song`)
            this.currentSong = this.queue.shift() || null;
            this.playSong(this.currentSong);
        } else {
            this.isPlaying = false;
            console.log("Queue is empty, no more songs to play.");
        }
    }


    public playSong(song: Song | null): void {
        if (song) {
            this.isPlaying = true;
            console.log(`Now playing: ${song.musicTitle}`);

            const audio = new Audio(song.musicUrl);
            audio.play();

            audio.addEventListener("ended", () => {
                console.log(`Finished playing: ${song.musicTitle}`);
                this.isPlaying = false;
                this.playNextSong();
            });
        }
    }


    public toggleLoop(): void {
        this.loop = !this.loop;
        console.log(`Looping is now ${this.loop ? "enabled" : "disabled"}`);
    }
}