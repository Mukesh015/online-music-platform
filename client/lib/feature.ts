
interface ReturnStatus {
    statusCode: number;
    status: 1 | 0;
}

const getMusicPath = (url: string) => {
    const decodedURL = decodeURIComponent(url);
    const parts = decodedURL.split('/');
    const fileNameWithParams = parts[parts.length - 1];
    const fileName = fileNameWithParams.split('?')[0];
    return fileName;
}

const getthumbnilPath = (url: string) => {
    const decodedURL = decodeURIComponent(url);
    const parts = decodedURL.split('/');
    const fileNameWithParams = parts[parts.length - 1];
    const fileId = fileNameWithParams.split('?')[0];
    return fileId;
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

async function addToHistory (){}

export { addToFavorite, deleteMusicFromDB };
