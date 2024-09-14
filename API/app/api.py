from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
import yt_dlp as youtube_dl
from pydub import AudioSegment
import io
import tempfile
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.get("/")
async def ping():
    return {"message": "Welcome to youtube API"}

@app.get("/convert-to-mp3/{video_id}")
async def convert_to_mp3(video_id: str):
    url = f"https://www.youtube.com/watch?v={video_id}"
    logger.info(f"Processing video URL: {url}")

    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_file:
        temp_filename = temp_file.name

    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': temp_filename,
            'headers': {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        }

        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        audio = AudioSegment.from_file(temp_filename, format="mp4")
        mp3_buffer = io.BytesIO()
        audio.export(mp3_buffer, format="mp3")
        mp3_buffer.seek(0)

        return StreamingResponse(mp3_buffer, media_type="audio/mpeg", headers={"Content-Disposition": "attachment; filename=audio.mp3"})

    except Exception as e:
        logger.error(f"Error processing video: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process video: {e}")

    finally:
       
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
