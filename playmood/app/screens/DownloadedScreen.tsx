import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

import * as FileSystem from 'expo-file-system';
import TrackPlayer from 'react-native-track-player';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import { usePlayerStore } from '../store/playerStore';
import PlaylistModal from '../components/PlaylistModal';
import MiniPlayer from '../components/MiniPlayer';

import {
  getDownloadedSongs,
  removeDownloadedSong,
  debugListFiles,
  saveDownloadedSongs
} from '../utils/songStorage';

const folderPath = FileSystem.documentDirectory + 'playmoods/';

export default function DownloadedScreen() {
  const [songs, setSongs] = React.useState<any[]>([]);
  const [playingSong, setPlayingSong] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const [playlistModalVisible, setPlaylistModalVisible] =
    React.useState(false);

  const [selectedSongForPlaylist, setSelectedSongForPlaylist] =
    React.useState<any>(null);

  const {
    setCurrentSong,
    setQueue,
    setCurrentIndex,
  } = usePlayerStore();

  const ensurePlayer = async () => {
    try {
      await TrackPlayer.getActiveTrackIndex();
    } catch {
      await TrackPlayer.setupPlayer();
    }
  };

  const rebuildFromFiles = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(folderPath);

      if (!dirInfo.exists) {
        setSongs([]);
        return;
      }

      const files = await FileSystem.readDirectoryAsync(folderPath);

      const audioFiles = files.filter(
        (f) =>
          f.endsWith('.m4a') ||
          f.endsWith('.mp3') ||
          f.endsWith('.aac')
      );

      const existingMetadata = await getDownloadedSongs();

      const rebuilt = audioFiles.map((file) => {
        const existing = existingMetadata.find((s) =>
          s.uri.includes(file)
        );

        if (existing) return existing;

        return {
          id: file,
          title: file.replace('.m4a', ''),
          uploader: 'Unknown Artist',
          duration: 0,
          thumbnail: '',
          uri: folderPath + file,
        };
      });

      await saveDownloadedSongs(rebuilt);
      setSongs(rebuilt);
    } catch (err) {
      console.log(err);
    }
  };

  const loadSongs = async () => {
  try {
    console.log("=== DOWNLOAD SCREEN LOAD ===");

    const downloadedSongs = await getDownloadedSongs();

    console.log("Songs from metadata:", downloadedSongs);

    await debugListFiles();

    setSongs(downloadedSongs);
  } catch (err) {
    console.log("loadSongs error:", err);
  }
};

  useFocusEffect(
    useCallback(() => {
      loadSongs();
    }, [])
  );

  const deleteSong = async (song: any) => {
    Alert.alert(
      'Delete Song',
      `Delete "${song.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(song.uri);
              await removeDownloadedSong(song.id);
              await loadSongs();
            } catch (err) {
              console.log(err);
            }
          },
        },
      ]
    );
  };

  const playSong = async (song: any) => {
    try {
      setPlayingSong(song.id);

      await ensurePlayer();

      const queueSongs = songs.map((s) => ({
        ...s,
        url: s.uri,
        artist: s.uploader,
      }));

      const selectedIndex = queueSongs.findIndex(
        (s) => s.id === song.id
      );

      await TrackPlayer.reset();
      await TrackPlayer.add(queueSongs);
      await TrackPlayer.skip(selectedIndex);
      await TrackPlayer.play();

      setQueue(queueSongs);
      setCurrentIndex(selectedIndex);
      setCurrentSong(song);

    } catch (error) {
      console.log(error);
      Alert.alert('Playback failed');
    } finally {
      setPlayingSong(null);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '--';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0d0d0d',
        paddingHorizontal: 16,
        paddingTop: 60,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            fontWeight: '700',
          }}
        >
          Downloaded Songs
        </Text>

        <TouchableOpacity onPress={loadSongs}>
          {refreshing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons
              name="refresh"
              size={26}
              color="white"
            />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={loadSongs}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#1a1a1a',
              borderRadius: 16,
              padding: 14,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {item.thumbnail ? (
              <Image
                source={{ uri: item.thumbnail }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                }}
                onError={() => {
                  item.thumbnail = '';
                  setSongs([...songs]);
                }}
              />
            ) : (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  backgroundColor: '#2a2a2a',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="musical-notes"
                  size={26}
                  color="white"
                />
              </View>
            )}

            <View
              style={{
                flex: 1,
                marginLeft: 14,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                {item.title}
              </Text>

              <Text
                numberOfLines={1}
                style={{
                  color: '#888',
                  marginTop: 4,
                }}
              >
                {item.uploader}
              </Text>

              <Text
                style={{
                  color: '#666',
                  marginTop: 4,
                }}
              >
                {formatDuration(item.duration)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setSelectedSongForPlaylist(item);
                setPlaylistModalVisible(true);
              }}
              style={{ marginRight: 12 }}
            >
              <Ionicons
                name="add-circle-outline"
                size={26}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteSong(item)}
              style={{ marginRight: 12 }}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color="#ff4d4d"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => playSong(item)}
            >
              <Ionicons
                name={
                  playingSong === item.id
                    ? 'hourglass'
                    : 'play'
                }
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}
      />

      <MiniPlayer />

      <PlaylistModal
        visible={playlistModalVisible}
        song={selectedSongForPlaylist}
        onClose={() => setPlaylistModalVisible(false)}
      />
    </View>
  );
}