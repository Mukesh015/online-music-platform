from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import io

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.post("/download-audio")
async def download_audio(request: Request):
    try:
        body = await request.json()
        youtube_url = body.get('youtube_url')
        if not youtube_url:
            return JSONResponse(content={"error": "YouTube URL is required"}, status_code=400)

        buffer = io.BytesIO()

      
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': '-', 
            'quiet': True,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'writesubtitles': False,
            'noplaylist': True,
            'progress_hooks': [lambda d: buffer.write(d.get('data', b''))],  # Append data to buffer
        }

   
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])

      
        buffer.seek(0)
        data = buffer.getvalue()

        if not data:
            return JSONResponse(content={"error": "No data was downloaded"}, status_code=500)

        content_length = len(data)

        headers = {
            "Content-Disposition": "attachment; filename=audio.mp3",
            "Content-Length": str(content_length) 
        }
        return StreamingResponse(io.BytesIO(data), media_type='audio/mpeg', headers=headers)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
