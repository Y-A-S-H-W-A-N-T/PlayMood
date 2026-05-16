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
    print("cwd:", os.getcwd())
    print("files:", os.listdir("."))

    file_id = str(uuid.uuid4())

    ydl_opts = {
        'format': 'bestaudio',
        'outtmpl': file_id + '.%(ext)s',
        'quiet': False,
        'noplaylist': True,
        'cookiefile': './cookies.txt',
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        ext = info.get('ext', 'm4a')

    return {
        "file": f"{file_id}.{ext}"
    }


# 🔥 STEP 2: DOWNLOAD FILE
@app.get("/get-file")
def get_file(file: str):
    print("Serving file:", file)
    return FileResponse(
        path=file,
        filename=file
    )