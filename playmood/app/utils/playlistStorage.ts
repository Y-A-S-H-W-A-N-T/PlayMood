import AsyncStorage from "@react-native-async-storage/async-storage";

const PLAYLIST_KEY = "playmood_playlists";

export type Song = {
  id: string;
  title: string;
  uri: string;
  uploader: string;
  duration: number;
  thumbnail: string;
};

export type Playlist = {
  id: string;
  name: string;
  songs: Song[];
};

export const getPlaylists = async (): Promise<Playlist[]> => {
  try {
    const data = await AsyncStorage.getItem(PLAYLIST_KEY);
    const parsed = data ? JSON.parse(data) : [];

    console.log("Loaded playlists:", parsed);

    return parsed;
  } catch {
    return [];
  }
};

export const savePlaylists = async (playlists: Playlist[]) => {
  await AsyncStorage.setItem(PLAYLIST_KEY, JSON.stringify(playlists));
};

export const createPlaylist = async (name: string, song?: Song) => {
  const playlists = await getPlaylists();

  const exists = playlists.find(
    (p) => p.name.toLowerCase() === name.toLowerCase(),
  );

  if (exists) return;

  const newPlaylist: Playlist = {
    id: Date.now().toString(),
    name,
    songs: song ? [song] : [],
  };

  playlists.push(newPlaylist);

  await savePlaylists(playlists);
};

export const addSongToPlaylists = async (playlistIds: string[], song: Song) => {
  const playlists = await getPlaylists();
  console.log("Adding song:", song);
  console.log("Playlist IDs:", playlistIds);
  console.log("Existing playlists:", playlists);

  const updated = playlists.map((playlist) => {
    if (!playlistIds.includes(playlist.id)) {
      return playlist;
    }

    const exists = playlist.songs.some((s) => s.id === song.id);

    if (exists) {
      return playlist;
    }

    return {
      ...playlist,
      songs: [...playlist.songs, song],
    };
  });
  console.log("Updated playlists:", updated);

  await savePlaylists(updated);
};

export const removeSongFromPlaylist = async (
  playlistId: string,
  songId: string,
) => {
  const playlists = await getPlaylists();

  const updated = playlists.map((playlist) => {
    if (playlist.id !== playlistId) return playlist;

    return {
      ...playlist,
      songs: playlist.songs.filter((song) => song.id !== songId),
    };
  });

  await savePlaylists(updated);
};

export const deletePlaylist = async (playlistId: string) => {
  const playlists = await getPlaylists();

  const updated = playlists.filter((playlist) => playlist.id !== playlistId);

  await savePlaylists(updated);
};

export const getSelectedPlaylistsForSong = async (songId: string) => {
  const playlists = await getPlaylists();

  return playlists
    .filter((playlist) => playlist.songs.some((song) => song.id === songId))
    .map((playlist) => playlist.id);
};
