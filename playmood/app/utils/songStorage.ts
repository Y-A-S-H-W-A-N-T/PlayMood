import * as FileSystem from 'expo-file-system';

const folderPath = FileSystem.documentDirectory + 'playmoods/';
const metadataPath = folderPath + 'metadata.json';

export type DownloadedSong = {
  id: string;
  title: string;
  uploader: string;
  duration: number;
  thumbnail: string;
  uri: string;
};

export const ensureSongStorage = async () => {
  console.log('=== ensureSongStorage ===');

  const dir = await FileSystem.getInfoAsync(folderPath);
  console.log('Folder exists:', dir.exists);

  if (!dir.exists) {
    await FileSystem.makeDirectoryAsync(folderPath, {
      intermediates: true,
    });
    console.log('Created folder');
  }

  const meta = await FileSystem.getInfoAsync(metadataPath);
  console.log('Metadata exists:', meta.exists);

  if (!meta.exists) {
    await FileSystem.writeAsStringAsync(
      metadataPath,
      JSON.stringify([])
    );
    console.log('Created metadata.json');
  }
};

export const getDownloadedSongs = async (): Promise<DownloadedSong[]> => {
  await ensureSongStorage();

  try {
    const raw = await FileSystem.readAsStringAsync(metadataPath);
    console.log('Metadata raw:', raw);

    const parsed = JSON.parse(raw || '[]');

    console.log('Downloaded songs loaded:', parsed);

    return parsed;
  } catch (err) {
    console.log('getDownloadedSongs error:', err);
    return [];
  }
};

export const saveDownloadedSongs = async (
  songs: DownloadedSong[]
) => {
  await ensureSongStorage();

  console.log('Saving songs:', songs);

  await FileSystem.writeAsStringAsync(
    metadataPath,
    JSON.stringify(songs)
  );

  console.log('Songs saved successfully');
};

export const addDownloadedSong = async (
  song: DownloadedSong
) => {
  console.log('=== addDownloadedSong ===');
  console.log('Incoming song:', song);

  const currentSongs = await getDownloadedSongs();

  console.log('Existing songs before add:', currentSongs);

  const existingIndex = currentSongs.findIndex(
    (s) => s.id === song.id
  );

  if (existingIndex >= 0) {
    console.log('Song already exists, replacing');
    currentSongs[existingIndex] = song;
  } else {
    console.log('Adding new song');
    currentSongs.push(song);
  }

  await saveDownloadedSongs(currentSongs);

  console.log('Final saved songs:', currentSongs);
};

export const removeDownloadedSong = async (
  songId: string
) => {
  console.log('Removing song:', songId);

  const songs = await getDownloadedSongs();

  const updated = songs.filter((s) => s.id !== songId);

  await saveDownloadedSongs(updated);
};

export const debugListFiles = async () => {
  await ensureSongStorage();

  const files = await FileSystem.readDirectoryAsync(folderPath);

  console.log('=== ACTUAL FILES IN PLAYMOODS ===');
  console.log(files);

  return files;
};