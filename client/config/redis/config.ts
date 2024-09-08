import { createClient } from 'redis';

type Music = {
    id: string | number;
    musicUrl: string;
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
}

const client = createClient({
    password: process.env.NEXT_PUBLIC_REDIS_PASSWORD,
    socket: {
        host: process.env.NEXT_PUBLIC_REDIS_HOST,
        port: 14520
    }
});

client.on('error', (err) => {
    console.error(`Error connecting to Redis: ${err}`);
});

if (!client.isOpen) {
    client.connect()
        .then(() => { console.log("Redis ready to catching...") })
        .catch((err) => { console.error(`Error connecting to Redis: ${err}`) });

}

async function craeteMusicById(music: Music) {

}

export {client,craeteMusicById}