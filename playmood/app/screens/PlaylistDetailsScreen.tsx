import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

import TrackPlayer from 'react-native-track-player';
import Ionicons from '@expo/vector-icons/Ionicons';

import { usePlayerStore } from '../store/playerStore';
import { removeSongFromPlaylist } from '../utils/playlistStorage';
import MiniPlayer from '../components/MiniPlayer';

export default function PlaylistDetailsScreen({
  route,
}: any) {
  const { playlist } = route.params;

  const [songs, setSongs] = React.useState(playlist.songs);

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

  const formatDuration = (seconds: number) => {
    if (!seconds) return '--';

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const playSong = async (song: any, index: number) => {
    try {
      await ensurePlayer();

      await TrackPlayer.reset();

      const queueSongs = songs.map((s: any) => ({
        ...s,
        url: s.uri,
        artist: s.uploader,
      }));

      await TrackPlayer.add(queueSongs);

      await TrackPlayer.skip(index);

      await TrackPlayer.play();

      setQueue(queueSongs);
      setCurrentIndex(index);
      setCurrentSong(song);
    } catch (error) {
      console.log(error);
      Alert.alert('Playback failed');
    }
  };

  const removeSong = async (songId: string) => {
    Alert.alert(
      'Remove Song',
      'Remove this song from playlist?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeSongFromPlaylist(
              playlist.id,
              songId
            );

            const updated = songs.filter(
              (song: any) => song.id !== songId
            );

            setSongs(updated);
          },
        },
      ]
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0d0d0d',
        padding: 16,
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 26,
          fontWeight: '700',
          marginBottom: 20,
        }}
      >
        {playlist.name}
      </Text>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
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
            <Image
              source={{ uri: item.thumbnail }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 12,
              }}
            />

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
              onPress={() => removeSong(item.id)}
              style={{ marginRight: 14 }}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color="#ff4d4d"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => playSong(item, index)}
            >
              <Ionicons
                name="play"
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}
      />
      <MiniPlayer />
    </View>
  );
}