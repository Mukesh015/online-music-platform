
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, UploadResult, deleteObject } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const storage = getStorage(app, process.env.NEXT_PUBLIC_FIREBASE_MUSIC_UPLOAD_URI);

const uploadMusic = async (music: File): Promise<UploadResult> => {
  const musicRef = ref(storage, `Musics/${music.name}_${Date.now()}`);
  const uploadUrl = await uploadBytes(musicRef, music);
  return uploadUrl;
};

const uploadMusicThumbnail = async (thumbnail: Blob): Promise<UploadResult> => {
  const urlRef = ref(storage, `Thumbnails/${Date.now()}`);
  const uploadUrl = await uploadBytes(urlRef, thumbnail);
  return uploadUrl;
}

const deleteMusic = async (musicPath: string, thumbnailPath: string) => {
  const musicRef = ref(storage, `Musics/${musicPath}`);
  const thumbnailRef = ref(storage, `Thumbnails/${thumbnailPath}`)
  const musicRes = await deleteObject(musicRef);
  const thumbnailRes = await deleteObject(thumbnailRef);
  return {
    music: musicRes,
    thumbnail: thumbnailRes,
  };
}

const getDownloadLink = async (path: string): Promise<string> => {
  return await getDownloadURL(ref(storage, path));
};

const downLoadMusic = async (musicUrl: string) => {

  try {
    const downloadUrl = await getDownloadURL(ref(storage, musicUrl));

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'your_mp3_file.mp3';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading MP3:', error);
  }
}

export { app, auth, deleteMusic, uploadMusic, getDownloadLink, uploadMusicThumbnail, downLoadMusic }
