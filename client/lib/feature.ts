
interface ReturnStatus {
    statusCode: number;
    status: 1 | 0;
}

interface Music {
    id: number;
    musicUrl: string;
    isFavourite: boolean;
    musicTitle: string;
    thumbnailUrl: string;
    musicArtist: string;
}

async function deleteMusicFromDB(musicId: number, token: string): Promise<ReturnStatus> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/music/${musicId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            return {
                statusCode: response.status,
                status: 1
            };
        }
        else {
            return {
                statusCode: response.status,
                status: 0
            };
        }
    }
    catch (error) {
        return {
            statusCode: 500,
            status: 0
        };
    }
}

async function addToFavorite(musicId: number, token: string): Promise<ReturnStatus> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/music/addtoFavorite/${musicId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            return {
                statusCode: response.status,
                status: 1
            };
        } else {
            return {
                statusCode: response.status,
                status: 0
            };
        }
    } catch (error) {
        console.error("fetch error:", error);
        return {
            statusCode: 500,
            status: 0
        };
    }
}

async function addToHistory(token: string, music: Music): Promise<ReturnStatus> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/signup/addtolasthistory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                musicId: music.id,
                musicUrl: music.musicUrl,
                thumbnailUrl: music.thumbnailUrl,
                musicTitle: music.musicTitle,
                musicArtist: music.musicArtist
            })
        });
        if (response.ok) {
            return {
                statusCode: response.status,
                status: 1
            };
        }
        else {
            return {
                statusCode: response.status,
                status: 0
            };
        }
    }
    catch (error) {
        console.error("fetch error:", error);
        return {
            statusCode: 500,
            status: 0
        }
    }
}

async function renamePlaylist(token: string, playlistName: string, newPlaylistName: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/rename/playlist`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                playlistName: playlistName,
                newPlaylistName: newPlaylistName
            })
        });
        if (response.ok) {
            return {
                statusCode: response.status,
                status: 1
            };
        }
        else {
            return {
                statusCode: response.status,
                status: 0
            };
        }
    }
    catch (error) {
        console.error("fetch error:", error);
        return {
            statusCode: 500,
            status: 0
        }
    }
}

async function deleteplaylist(token: string, playlistName: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/delete/playlist`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                playlistName: playlistName
            })
        });
        if (response.ok) {
            return {
                statusCode: response.status,
                status: 1
            };
        }
        else {
            return {
                statusCode: response.status,
                status: 0
            };
        }
    } catch (error) {
        console.error("fetch error:", error);
        return {
            statusCode: 500,
            status: 0
        }
    }
}

export { addToFavorite, deleteMusicFromDB, addToHistory, renamePlaylist, deleteplaylist };
