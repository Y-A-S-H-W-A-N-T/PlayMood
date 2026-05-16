from fastapi import FastAPI
from fastapi.responses import FileResponse
import yt_dlp
import uuid
import os

app = FastAPI()

# 🔍 SEARCH API
def fetch_youtube_metadata(search_phrase, max_results=10):

    print(f"Fetching metadata for search phrase: '{search_phrase}' with max results: {max_results}")
    search_query = f"ytsearch{max_results}:{search_phrase}"

    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'skip_download': True,
    }

    metadata_list = []

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(search_query, download=False)

        if 'entries' in info:
            for entry in info['entries']:
                metadata_list.append({
                    'title': entry.get('title'),
                    'url': f"https://www.youtube.com/watch?v={entry.get('id')}",
                    'thumbnail': f"https://i.ytimg.com/vi/{entry.get('id')}/hqdefault.jpg",
                    'uploader': entry.get('uploader'),
                    'duration': entry.get('duration')
                })


    print("Fetched metadata for search query:", metadata_list)
    return metadata_list


@app.get("/search")
def search(q: str):
    return fetch_youtube_metadata(q)


# 🔥 STEP 1: PREPARE DOWNLOAD (NO TIMEOUT ISSUE)
@app.get("/prepare-download")
def prepare_download(url: str):
    filename = f"{uuid.uuid4()}.m4a"

    ydl_opts = {
        'format': 'bestaudio[ext=m4a]/bestaudio/best',
        'outtmpl': filename,
        'quiet': True,
        'noplaylist': True,
        'cookiefile': 'cookies.txt',
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    return {"file": filename}


# 🔥 STEP 2: DOWNLOAD FILE
@app.get("/get-file")
def get_file(file: str):
    return FileResponse(
        path=file,
        media_type='audio/mp4',
        filename="song.m4a"
    )